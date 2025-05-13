class UsersResourcesSerializer < ActiveModel::Serializer
  attributes :id, :resource_id, :user_id
end
