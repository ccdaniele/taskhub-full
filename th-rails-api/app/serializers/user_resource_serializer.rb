class UserResourceSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :resource_id, :created_at
end
