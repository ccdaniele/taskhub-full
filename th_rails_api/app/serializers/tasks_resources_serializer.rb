class TasksResourcesSerializer < ActiveModel::Serializer
  attributes :id, :resource_id, :task_id
end
