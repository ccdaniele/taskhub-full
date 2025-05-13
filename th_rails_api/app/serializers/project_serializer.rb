class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :time, :budget, :starting_at, :ending_at, :public, :status, :deadline, :spent
end
