class TaskResource < ApplicationRecord
  belongs_to :task
  belongs_to :resource
end
