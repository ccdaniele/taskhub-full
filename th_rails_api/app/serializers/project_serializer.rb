class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :time, :budget
end
