class ProjectTaskSerializer < ActiveModel::Serializer
  attributes :id, :project_id, :task_id, :created_at
end
