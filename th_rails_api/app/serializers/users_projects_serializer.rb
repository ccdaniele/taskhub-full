class UsersProjectsSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :project_id
end
