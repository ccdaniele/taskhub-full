class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :time, :cost, :starting_at, :ending_at, :spent, :status, :public
end
