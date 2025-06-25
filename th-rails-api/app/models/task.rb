class Task < ApplicationRecord

  has_many :project_tasks
  has_many :projects, through: :project_tasks

  has_many :task_resources
  has_many :resources, through: :task_resources

  has_many :task_tags
  has_many :tags, through: :task_tags

  has_many :user_tasks
  has_many :users, through: :user_tasks

end
