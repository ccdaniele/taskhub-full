class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :post_type, :public, :created_at, :updated_at, :likes_count, :comments_count, :related_item_type

  belongs_to :user
  belongs_to :project, optional: true
  belongs_to :task, optional: true
  belongs_to :resource, optional: true
  has_many :comments
  has_many :likes
end 
