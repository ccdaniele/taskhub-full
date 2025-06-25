class TagSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :public

  has_many :projects
  has_many :tasks
  has_many :resources
end
