class Project < ApplicationRecord
  has_many :user_projects
  has_many :users, through: :user_projects

  has_many :project_tasks
  has_many :tasks, through: :project_tasks

  has_many :project_resources
  has_many :resources, through: :project_resources

  has_many :project_tags
  has_many :tags, through: :project_tags
end
