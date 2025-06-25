# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

require 'faker'

# Clear existing data (optional in dev)
User.destroy_all
Project.destroy_all
Task.destroy_all
Resource.destroy_all
Tag.destroy_all

UserProject.destroy_all
UserTask.destroy_all
UserResource.destroy_all

ProjectTask.destroy_all
ProjectResource.destroy_all
ProjectTag.destroy_all

TaskResource.destroy_all
TaskTag.destroy_all
ResourceTag.destroy_all

puts "Creating seed data..."

# Create users
puts "Creating users..."
users = 5.times.map do
  User.create!(
    username: Faker::Internet.username,
    email: Faker::Internet.email,
    password_digest: "12345"
  )
end

# Create projects with more DIY-appropriate names
puts "Creating projects..."
project_names = [
  "Kitchen Cabinet Refinishing",
  "Backyard Garden Shed Build",
  "Living Room Wall Painting", 
  "Bathroom Tile Installation",
  "Wooden Deck Construction",
  "Home Office Organization",
  "Outdoor Fire Pit Build",
  "Children's Treehouse Project",
  "Solar Panel Installation",
  "Smart Home Automation"
]

projects = project_names.map do |name|
  Project.create!(
    name: name,
    time: Faker::Number.between(from: 20, to: 200),
    budget: Faker::Number.between(from: 100, to: 2000),
    starting_at: Faker::Date.backward(days: 30),
    ending_at: Faker::Date.forward(days: 60),
    public: Faker::Boolean.boolean(true_ratio: 0.7), # More projects public
    spent: Faker::Number.between(from: 50, to: 1500),
    status: %w[pending active complete].sample,
    deadline: Faker::Date.forward(days: 90)
  )
end

# Create tasks with more realistic DIY task names
puts "Creating tasks..."
task_categories = {
  "Planning & Design" => ["Research materials", "Create design plans", "Measure spaces", "Get permits"],
  "Preparation" => ["Clear workspace", "Gather tools", "Purchase materials", "Prepare surfaces"],
  "Construction" => ["Cut materials", "Assemble frame", "Install hardware", "Apply finish"],
  "Installation" => ["Mount fixtures", "Connect wiring", "Test functionality", "Make adjustments"],
  "Finishing" => ["Sand surfaces", "Apply paint/stain", "Install trim", "Clean up workspace"]
}

tasks = []
30.times do
  category = task_categories.keys.sample
  task_name = task_categories[category].sample
  
  tasks << Task.create!(
    name: "#{category}: #{task_name}",
    time: Faker::Number.between(from: 1, to: 20),
    cost: Faker::Number.between(from: 10, to: 300),
    ending_at: Faker::Date.forward(days: 45),
    starting_at: Faker::Date.backward(days: 5),
    public: Faker::Boolean.boolean(true_ratio: 0.6),
    spent: Faker::Number.between(from: 0, to: 250),
    status: %w[pending in_progress completed].sample
  )
end

# Create resources with DIY-appropriate items
puts "Creating resources..."
resource_categories = {
  "Tools" => ["Circular Saw", "Drill", "Screwdriver Set", "Measuring Tape", "Level", "Hammer"],
  "Materials" => ["2x4 Lumber", "Screws", "Paint", "Sandpaper", "Wood Stain", "Concrete"],
  "Hardware" => ["Hinges", "Door Handles", "Light Fixtures", "Electrical Wire", "Plumbing Fittings"],
  "Safety" => ["Safety Glasses", "Work Gloves", "Dust Mask", "Hard Hat", "First Aid Kit"]
}

resources = []
40.times do
  category = resource_categories.keys.sample
  item = resource_categories[category].sample
  
  resources << Resource.create!(
    name: "#{category}: #{item}",
    price: Faker::Number.between(from: 5, to: 200),
    source: ["Home Depot", "Lowe's", "Amazon", "Local Hardware Store", "Specialty Shop"].sample,
    status: %w[available used broken].sample,
    public: Faker::Boolean.boolean(true_ratio: 0.8)
  )
end

# Create tags
puts "Creating tags..."
tag_names = [
  "Woodworking", "Electrical", "Plumbing", "Painting", "Beginner-Friendly",
  "Advanced", "Outdoor", "Indoor", "Weekend Project", "Budget-Friendly",
  "Tools Required", "Professional Help Needed", "Safety Critical", "Seasonal"
]

tags = tag_names.map do |name|
  Tag.create!(
    name: name,
    public: Faker::Boolean.boolean(true_ratio: 0.9),
    description: Faker::Lorem.sentence
  )
end

puts "Creating associations..."

# Associate users with projects (each user has 2-4 projects)
users.each do |user|
  assigned_projects = projects.sample(Faker::Number.between(from: 2, to: 4))
  assigned_projects.each do |project|
    UserProject.find_or_create_by(user: user, project: project)
  end
end

# Associate tasks with projects (ensure every task belongs to at least one project)
# Each project gets 3-6 tasks
projects.each do |project|
  project_tasks = tasks.sample(Faker::Number.between(from: 3, to: 6))
  project_tasks.each do |task|
    ProjectTask.find_or_create_by(project: project, task: task)
  end
end

# Make sure remaining tasks are also assigned to projects
unassigned_tasks = tasks.reject { |task| task.projects.any? }
unassigned_tasks.each do |task|
  project = projects.sample
  ProjectTask.find_or_create_by(project: project, task: task)
end

# Associate users with tasks (users work on tasks from their projects)
users.each do |user|
  # Get tasks from user's projects
  user_project_tasks = user.projects.flat_map(&:tasks).uniq
  assigned_tasks = user_project_tasks.sample(Faker::Number.between(from: 3, to: 8))
  
  assigned_tasks.each do |task|
    UserTask.find_or_create_by(user: user, task: task)
  end
end

# Associate resources with projects (each project needs 3-8 resources)
projects.each do |project|
  project_resources = resources.sample(Faker::Number.between(from: 3, to: 8))
  project_resources.each do |resource|
    ProjectResource.find_or_create_by(project: project, resource: resource)
  end
end

# Associate resources with tasks (each task needs 1-4 resources)
tasks.each do |task|
  task_resources = resources.sample(Faker::Number.between(from: 1, to: 4))
  task_resources.each do |resource|
    TaskResource.find_or_create_by(task: task, resource: resource)
  end
end

# Associate users with resources (users own/have access to resources)
users.each do |user|
  user_resources = resources.sample(Faker::Number.between(from: 5, to: 15))
  user_resources.each do |resource|
    UserResource.find_or_create_by(user: user, resource: resource)
  end
end

# Associate tags with projects (2-4 tags per project)
projects.each do |project|
  project_tags = tags.sample(Faker::Number.between(from: 2, to: 4))
  project_tags.each do |tag|
    ProjectTag.find_or_create_by(project: project, tag: tag)
  end
end

# Associate tags with tasks (1-3 tags per task)
tasks.each do |task|
  task_tags = tags.sample(Faker::Number.between(from: 1, to: 3))
  task_tags.each do |tag|
    TaskTag.find_or_create_by(task: task, tag: tag)
  end
end

# Associate tags with resources (1-2 tags per resource)
resources.each do |resource|
  resource_tags = tags.sample(Faker::Number.between(from: 1, to: 2))
  resource_tags.each do |tag|
    ResourceTag.find_or_create_by(resource: resource, tag: tag)
  end
end

puts "Seed data created successfully!"
puts "Created:"
puts "  #{User.count} users"
puts "  #{Project.count} projects"
puts "  #{Task.count} tasks"
puts "  #{Resource.count} resources"
puts "  #{Tag.count} tags"
puts ""
puts "Associations:"
puts "  #{UserProject.count} user-project associations"
puts "  #{UserTask.count} user-task associations"
puts "  #{UserResource.count} user-resource associations"
puts "  #{ProjectTask.count} project-task associations"
puts "  #{ProjectResource.count} project-resource associations"
puts "  #{ProjectTag.count} project-tag associations"
puts "  #{TaskResource.count} task-resource associations"
puts "  #{TaskTag.count} task-tag associations"
puts "  #{ResourceTag.count} resource-tag associations"

# Show some statistics
puts ""
puts "Statistics:"
puts "  Tasks with projects: #{Task.joins(:projects).distinct.count}/#{Task.count}"
puts "  Projects with tasks: #{Project.joins(:tasks).distinct.count}/#{Project.count}"
puts "  Average tasks per project: #{(Task.joins(:projects).count.to_f / Project.count).round(1)}"
