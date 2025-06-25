class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :time, :budget, :starting_at, :ending_at, :status, :deadline, :spent, :public

  has_many :tasks
  has_many :resources
  has_many :tags
  has_many :users
end
