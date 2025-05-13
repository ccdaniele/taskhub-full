class TasksTagsSerializer < ActiveModel::Serializer
  attributes :id, :task_id, :tag_id
end
