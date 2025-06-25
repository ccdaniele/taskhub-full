class TaskResourceSerializer < ActiveModel::Serializer
  attributes :id, :task_id, :resource_id, :created_at
end
