class User < ApplicationRecord
  has_many :user_projects
  has_many :projects, through: :user_projects

  has_many :user_tasks
  has_many :tasks, through: :user_tasks

  has_many :user_resources
  has_many :resources, through: :user_resources
  
  # Community features
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  
  # Social features - Following (one-way)
  has_many :active_follows, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :passive_follows, class_name: 'Follow', foreign_key: 'followed_id', dependent: :destroy
  has_many :following, through: :active_follows, source: :followed
  has_many :followers, through: :passive_follows, source: :follower
  
  # Social features - Friendships (mutual)
  has_many :sent_friend_requests, class_name: 'Friendship', foreign_key: 'requester_id', dependent: :destroy
  has_many :received_friend_requests, class_name: 'Friendship', foreign_key: 'requestee_id', dependent: :destroy
  
  # Authentication
  has_secure_password
  
  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 30 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  
  # Email verification
  before_create :generate_email_verification_token
  
  def display_name
    username.presence || email.split('@').first
  end
  
  def email_verified?
    email_verified_at.present?
  end
  
  def verify_email!
    update!(email_verified_at: Time.current, email_verification_token: nil)
  end
  
  def generate_email_verification_token
    self.email_verification_token = SecureRandom.urlsafe_base64(32)
    self.email_verification_sent_at = Time.current
  end
  
  def resend_email_verification
    generate_email_verification_token
    save!
    UserMailer.email_verification(self).deliver_now
  end
  
  # Password reset functionality
  def generate_password_reset_token
    self.password_reset_token = SecureRandom.urlsafe_base64(32)
    self.password_reset_sent_at = Time.current
  end
  
  def password_reset_token_valid?
    password_reset_sent_at.present? && password_reset_sent_at > 2.hours.ago
  end
  
  # Social methods
  def follow(user)
    return false if user == self || following?(user)
    active_follows.create(followed: user)
  end
  
  def unfollow(user)
    active_follows.find_by(followed: user)&.destroy
  end
  
  def following?(user)
    following.include?(user)
  end
  
  def send_friend_request(user)
    return false if user == self || friend_request_sent?(user) || friends_with?(user)
    sent_friend_requests.create(requestee: user, status: 'pending')
  end
  
  def accept_friend_request(user)
    friendship = received_friend_requests.find_by(requester: user, status: 'pending')
    return false unless friendship
    friendship.update(status: 'accepted')
  end
  
  def decline_friend_request(user)
    friendship = received_friend_requests.find_by(requester: user, status: 'pending')
    return false unless friendship
    friendship.update(status: 'declined')
  end
  
  def remove_friend(user)
    friendship = Friendship.find_by(
      "(requester_id = ? AND requestee_id = ?) OR (requester_id = ? AND requestee_id = ?)",
      id, user.id, user.id, id
    )
    friendship&.destroy
  end
  
  def friend_request_sent?(user)
    sent_friend_requests.exists?(requestee: user, status: 'pending')
  end
  
  def friend_request_received?(user)
    received_friend_requests.exists?(requester: user, status: 'pending')
  end
  
  def friends_with?(user)
    Friendship.exists?(
      "(requester_id = ? AND requestee_id = ? AND status = 'accepted') OR (requester_id = ? AND requestee_id = ? AND status = 'accepted')",
      id, user.id, user.id, id
    )
  end
  
  def friends
    friend_ids = Friendship.where(
      "(requester_id = ? OR requestee_id = ?) AND status = 'accepted'",
      id, id
    ).pluck(:requester_id, :requestee_id).flatten - [id]
    
    User.where(id: friend_ids)
  end
  
  def pending_friend_requests
    received_friend_requests.where(status: 'pending').includes(:requester)
  end
  
  # Privacy methods
  def can_view_profile?(current_user)
    return true if current_user == self
    return false if private_profile?
    true
  end
  
  def can_view_posts?(current_user)
    return true if current_user == self
    return false if private_profile? && !friends_with?(current_user)
    true
  end
  
  private
  
  def private_profile?
    !public?
  end
end
