class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :time, :cost
end
