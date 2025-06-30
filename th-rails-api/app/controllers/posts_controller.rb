class PostsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_post, only: [:show, :update, :destroy]
  before_action :check_post_permissions, only: [:show]
  before_action :check_post_ownership, only: [:update, :destroy]

  # GET /posts - Public community feed
  def index
    @posts = Post.includes(:user, :project, :task, :resource, :comments, :likes)
                 .public_posts
                 .recent
    
    # Filter by post type if specified
    @posts = @posts.by_type(params[:type]) if params[:type].present?
    
    # Search by keywords if specified
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      @posts = @posts.where("title ILIKE ? OR content ILIKE ?", search_term, search_term)
    end
    
    # Filter by tags if specified
    if params[:tags].present?
      tag_names = params[:tags].split(',').map(&:strip)
      @posts = @posts.joins(project: :tags).where(tags: { name: tag_names }) if tag_names.any?
    end
    
    # Only show posts from users with public profiles or that current user can see
    if current_user
      visible_user_ids = User.joins("LEFT JOIN friendships ON (friendships.requester_id = users.id AND friendships.requestee_id = #{current_user.id} AND friendships.status = 'accepted') OR (friendships.requestee_id = users.id AND friendships.requester_id = #{current_user.id} AND friendships.status = 'accepted')")
                            .where("users.public = ? OR friendships.id IS NOT NULL OR users.id = ?", true, current_user.id)
                            .pluck(:id)
      @posts = @posts.where(user_id: visible_user_ids)
    else
      @posts = @posts.joins(:user).where(users: { public: true })
    end
    
    # Pagination
    limit = [params[:limit]&.to_i || 20, 50].min
    offset = params[:offset]&.to_i || 0
    @posts = @posts.limit(limit).offset(offset)
    
    render json: serialize_posts(@posts)
  end

  # GET /posts/1
  def show
    render json: serialize_post(@post)
  end

  # POST /posts
  def create
    @post = current_user.posts.build(post_params)

    if @post.save
      render json: serialize_post(@post), status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  def update
    if @post.update(post_params)
      render json: serialize_post(@post)
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy
    @post.destroy
    head :no_content
  end

  # GET /feed - General personalized feed (same as index but for authenticated users)
  def feed
    authenticate_user!
    index
  end

  # GET /feed/friends - Posts from friends only
  def friends_feed
    authenticate_user!
    
    friend_ids = current_user.friends.pluck(:id)
    @posts = Post.includes(:user, :project, :task, :resource, :comments, :likes)
                 .where(user_id: friend_ids + [current_user.id])
                 .recent
    
    apply_filters
    render json: serialize_posts(@posts)
  end

  # GET /feed/following - Posts from users you're following
  def following_feed
    authenticate_user!
    
    following_ids = current_user.following.pluck(:id)
    @posts = Post.includes(:user, :project, :task, :resource, :comments, :likes)
                 .where(user_id: following_ids + [current_user.id])
                 .recent
    
    apply_filters
    render json: serialize_posts(@posts)
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

  def set_post
    @post = Post.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Post not found' }, status: :not_found
  end

  def check_post_permissions
    unless @post.user.can_view_posts?(current_user)
      render json: { error: 'Access denied' }, status: :forbidden
    end
  end

  def check_post_ownership
    unless @post.user == current_user
      render json: { error: 'Access denied' }, status: :forbidden
    end
  end

  def apply_filters
    # Filter by post type if specified
    @posts = @posts.by_type(params[:type]) if params[:type].present?
    
    # Search by keywords if specified
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      @posts = @posts.where("title ILIKE ? OR content ILIKE ?", search_term, search_term)
    end
    
    # Pagination
    limit = [params[:limit]&.to_i || 20, 50].min
    offset = params[:offset]&.to_i || 0
    @posts = @posts.limit(limit).offset(offset)
  end

  def serialize_post(post)
    {
      id: post.id,
      title: post.title,
      content: post.content,
      post_type: post.post_type,
      public: post.public,
      created_at: post.created_at,
      updated_at: post.updated_at,
      user: {
        id: post.user.id,
        username: post.user.username,
        display_name: post.user.display_name
      },
      project: post.project ? { id: post.project.id, name: post.project.name } : nil,
      task: post.task ? { id: post.task.id, name: post.task.name } : nil,
      resource: post.resource ? { id: post.resource.id, name: post.resource.name } : nil,
      likes_count: post.likes.count,
      comments_count: post.comments.count,
      liked_by_current_user: current_user ? post.liked_by?(current_user) : false
    }
  end

  def serialize_posts(posts)
    posts.map { |post| serialize_post(post) }
  end

  def post_params
    params.require(:post).permit(:title, :content, :post_type, :public, :project_id, :task_id, :resource_id)
  end
end
