class User < ApplicationRecord
  has_many :user_projects
  has_many :projects, through: :user_projects

  has_many :user_tasks
  has_many :tasks, through: :user_tasks

  has_many :user_resources
  has_many :resources, through: :user_resources
end
