class ProjectsTasksSerializer < ActiveModel::Serializer
  attributes :id, :project_id, :task_id
end
