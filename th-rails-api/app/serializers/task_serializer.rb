class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :time, :cost, :ending_at, :status, :spent, :public

  has_many :projects
  has_many :resources
  has_many :tags
  has_many :users
end
