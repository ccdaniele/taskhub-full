class SocialController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:follow, :unfollow, :send_friend_request, :accept_friend_request, :decline_friend_request, :remove_friend]
  
  # GET /social/followers
  def followers
    user = params[:user_id] ? User.find(params[:user_id]) : current_user
    render json: { followers: user.followers.map { |u| user_summary(u) } }
  end
  
  # GET /social/following
  def following
    user = params[:user_id] ? User.find(params[:user_id]) : current_user
    render json: { following: user.following.map { |u| user_summary(u) } }
  end
  
  # GET /social/friends
  def friends
    user = params[:user_id] ? User.find(params[:user_id]) : current_user
    render json: { friends: user.friends.map { |u| user_summary(u) } }
  end
  
  # GET /social/friend_requests
  def friend_requests
    pending_requests = current_user.pending_friend_requests.map do |friendship|
      {
        id: friendship.id,
        requester: user_summary(friendship.requester),
        created_at: friendship.created_at
      }
    end
    
    render json: { friend_requests: pending_requests }
  end
  
  # POST /social/follow/:id
  def follow
    if current_user.follow(@user)
      render json: { message: "You are now following #{@user.username}" }
    else
      render json: { error: 'Unable to follow user' }, status: :unprocessable_entity
    end
  end
  
  # DELETE /social/unfollow/:id
  def unfollow
    if current_user.unfollow(@user)
      render json: { message: "You unfollowed #{@user.username}" }
    else
      render json: { error: 'Unable to unfollow user' }, status: :unprocessable_entity
    end
  end
  
  # POST /social/friend_request/:id
  def send_friend_request
    if current_user.send_friend_request(@user)
      render json: { message: "Friend request sent to #{@user.username}" }
    else
      render json: { error: 'Unable to send friend request' }, status: :unprocessable_entity
    end
  end
  
  # POST /social/accept_friend_request/:id
  def accept_friend_request
    if current_user.accept_friend_request(@user)
      render json: { message: "You are now friends with #{@user.username}" }
    else
      render json: { error: 'Unable to accept friend request' }, status: :unprocessable_entity
    end
  end
  
  # POST /social/decline_friend_request/:id
  def decline_friend_request
    if current_user.decline_friend_request(@user)
      render json: { message: 'Friend request declined' }
    else
      render json: { error: 'Unable to decline friend request' }, status: :unprocessable_entity
    end
  end
  
  # DELETE /social/remove_friend/:id
  def remove_friend
    if current_user.remove_friend(@user)
      render json: { message: "You are no longer friends with #{@user.username}" }
    else
      render json: { error: 'Unable to remove friend' }, status: :unprocessable_entity
    end
  end
  
  # GET /social/search_users
  def search_users
    query = params[:q]
    return render json: { users: [] } if query.blank?
    
    users = User.where("username ILIKE ? OR email ILIKE ?", "%#{query}%", "%#{query}%")
                .where.not(id: current_user.id)
                .limit(20)
    
    users_with_status = users.map do |user|
      user_summary(user).merge(
        relationship_status: get_relationship_status(user),
        is_following: current_user.following?(user),
        is_friend: current_user.friends_with?(user)
      )
    end
    
    render json: { users: users_with_status }
  end
  
  # GET /social/suggestions
  def suggestions
    # Get users that current user's friends are following
    friend_ids = current_user.friends.pluck(:id)
    following_ids = current_user.following.pluck(:id) + [current_user.id]
    
    suggested_users = User.joins(:passive_follows)
                         .where(follows: { follower_id: friend_ids })
                         .where.not(id: following_ids)
                         .distinct
                         .limit(10)
    
    suggestions = suggested_users.map do |user|
      user_summary(user).merge(
        mutual_friends_count: (current_user.friends.pluck(:id) & user.friends.pluck(:id)).count
      )
    end
    
    render json: { suggestions: suggestions }
  end
  
  private
  
  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    
    if token
      begin
        decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base, true, algorithm: 'HS256')
        user_id = decoded_token[0]['user_id']
        @current_user = User.find(user_id)
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render json: { error: 'Invalid or expired token' }, status: :unauthorized
      end
    else
      render json: { error: 'Token required' }, status: :unauthorized
    end
  end
  
  def current_user
    @current_user
  end
  
  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end
  
  def user_summary(user)
    {
      id: user.id,
      username: user.username,
      email: user.public? ? user.email : nil,
      display_name: user.display_name,
      public: user.public?
    }
  end
  
  def get_relationship_status(user)
    return :self if user == current_user
    return :friends if current_user.friends_with?(user)
    return :friend_request_sent if current_user.friend_request_sent?(user)
    return :friend_request_received if current_user.friend_request_received?(user)
    return :following if current_user.following?(user)
    :none
  end
end 
