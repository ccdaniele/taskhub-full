class UsersTasksSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :task_id
end
