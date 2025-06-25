class ResourceSerializer < ActiveModel::Serializer
  attributes :id, :name, :price, :source, :status, :public

  has_many :projects
  has_many :tasks
  has_many :tags
  has_many :users
end
