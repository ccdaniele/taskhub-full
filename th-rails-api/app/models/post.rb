class Post < ApplicationRecord
  belongs_to :user
  belongs_to :project, optional: true
  belongs_to :task, optional: true
  belongs_to :resource, optional: true
  
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  
  validates :title, presence: true, length: { maximum: 200 }
  validates :content, presence: true, length: { maximum: 5000 }
  validates :post_type, presence: true, inclusion: { in: %w[update showcase question tip general] }
  validates :public, inclusion: { in: [true, false] }
  
  # Ensure at least one of the optional associations is present for certain post types
  validate :has_related_content, if: -> { %w[update showcase].include?(post_type) }
  
  scope :public_posts, -> { where(public: true) }
  scope :recent, -> { order(created_at: :desc) }
  scope :by_type, ->(type) { where(post_type: type) }
  
  def liked_by?(user)
    return false unless user
    likes.exists?(user: user)
  end
  
  def likes_count
    likes.count
  end
  
  def comments_count
    comments.count
  end
  
  def related_item
    project || task || resource
  end
  
  def related_item_type
    return 'project' if project
    return 'task' if task
    return 'resource' if resource
    nil
  end
  
  private
  
  def has_related_content
    if project.nil? && task.nil? && resource.nil?
      errors.add(:base, "#{post_type.capitalize} posts must be related to a project, task, or resource")
    end
  end
end
