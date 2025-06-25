class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :email, :public

  has_many :projects
  has_many :tasks
  has_many :resources
end
