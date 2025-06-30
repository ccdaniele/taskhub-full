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
users = []

# Create a test user with known credentials
test_user = User.create!(
  username: "testuser",
  email: "test@example.com", 
  password: "password123",
  password_confirmation: "password123",
  public: true,
  email_verified_at: Time.current
)
users << test_user

# Create additional random users
4.times do
  users << User.create!(
    username: Faker::Internet.username,
    email: Faker::Internet.email,
    password: "password123",
    password_confirmation: "password123",
    public: true,
    email_verified_at: Time.current
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

# Create community posts
puts "Creating community posts..."

post_types = %w[update showcase question tip general]
post_content = {
  "update" => [
    "Just finished the framing for my deck! The weather held up perfectly and everything is level. Next step is laying the decking boards.",
    "Made great progress on the kitchen cabinet refinishing today. The sanding took forever but the primer went on smoothly.",
    "Hit a snag with the electrical work - turns out I need a permit for this. Taking a break to get the paperwork sorted.",
    "Bathroom tile installation is complete! It took way longer than expected but I'm really happy with how it turned out.",
    "Garden shed is finally weatherproofed. The roof was the trickiest part but YouTube tutorials saved the day!"
  ],
  "showcase" => [
    "Finally completed my home office makeover! Built custom shelving and a standing desk. So much more productive now.",
    "Check out my DIY fire pit! Used reclaimed bricks and it came out better than I hoped. Perfect for summer evenings.",
    "Finished the treehouse for my kids! It's got a rope ladder, slide, and even a small deck. They absolutely love it.",
    "My first attempt at solar panel installation was a success! Already seeing a reduction in the electric bill.",
    "Transformed our boring fence into a living wall with built-in planters. The neighbors are already asking for tips!"
  ],
  "question" => [
    "What's the best way to remove old paint from wooden furniture? I've tried sanding but it's taking forever.",
    "Has anyone installed a smart home system themselves? I'm looking at options but not sure about the complexity.",
    "Need advice on concrete mixing ratios for a small patio project. First time working with concrete!",
    "What tools are absolutely essential for basic electrical work? Building a workshop and want to be prepared.",
    "Any tips for keeping a project on budget? I always seem to go over my initial estimates."
  ],
  "tip" => [
    "Pro tip: Always buy 10% more materials than you calculate. You'll thank me later when you don't have to make another trip to the store.",
    "When painting, use a high-quality brush for cutting in. It makes all the difference in getting clean lines.",
    "Measure twice, cut once - but also take photos of your measurements. Saved me so many times!",
    "Keep a project journal with photos. It's amazing how much you forget between sessions, and it helps with future projects.",
    "Invest in good safety equipment first. A project isn't worth an injury, and quality gear lasts for years."
  ],
  "general" => [
    "Anyone else find DIY projects therapeutic? There's something satisfying about building something with your own hands.",
    "What's everyone working on this weekend? I'm debating between starting the bathroom renovation or finishing the deck.",
    "Shoutout to this community for all the help and inspiration! Started as a complete beginner and now I'm tackling major projects.",
    "Weather's perfect for outdoor projects. Time to finally tackle that fence repair I've been putting off.",
    "Found an amazing deal on tools at the local hardware store. Sometimes it pays to shop around!"
  ]
}

posts = []
50.times do
  post_type = post_types.sample
  content_options = post_content[post_type]
  
  # For update and showcase posts, link to a project/task/resource
  project_id = nil
  task_id = nil
  resource_id = nil
  
  if %w[update showcase].include?(post_type)
    case rand(3)
    when 0
      project_id = projects.sample.id
    when 1
      task_id = tasks.sample.id
    when 2
      resource_id = resources.sample.id
    end
  end
  
  posts << Post.create!(
    user: users.sample,
    title: case post_type
           when 'update'
             ["Project Update", "Progress Report", "Quick Update", "Latest Progress"].sample
           when 'showcase'
             ["Project Complete!", "Check This Out!", "Finished Project", "DIY Success!"].sample
           when 'question'
             ["Need Help", "Quick Question", "Advice Needed", "Anyone Know?"].sample
           when 'tip'
             ["Pro Tip", "Learned This Today", "Helpful Hint", "DIY Tip"].sample
           when 'general'
             ["Weekend Plans", "DIY Life", "Community Chat", "Random Thoughts"].sample
           end,
    content: content_options.sample,
    post_type: post_type,
    public: Faker::Boolean.boolean(true_ratio: 0.9),
    project_id: project_id,
    task_id: task_id,
    resource_id: resource_id,
    created_at: Faker::Time.backward(days: 30)
  )
end

# Create comments on posts
puts "Creating comments..."
comments = []
posts.each do |post|
  # Each post gets 0-5 comments
  comment_count = Faker::Number.between(from: 0, to: 5)
  comment_count.times do
    comments << Comment.create!(
      user: users.sample,
      post: post,
      content: [
        "Great work! This looks amazing.",
        "Thanks for sharing! Very helpful.",
        "I'm working on something similar. Mind if I ask where you got your materials?",
        "Nice job! How long did this take you?",
        "This is exactly what I needed to see. Thanks!",
        "Looks professional! You should be proud.",
        "Any tips for a beginner trying this?",
        "Love the creativity! Never would have thought of that approach.",
        "This is inspiring me to start my own project.",
        "Great documentation! Very helpful for others."
      ].sample,
      created_at: Faker::Time.between(from: post.created_at, to: Time.current)
    )
  end
end

# Create likes on posts
puts "Creating likes..."
posts.each do |post|
  # Each post gets 0-8 likes from different users
  liking_users = users.sample(Faker::Number.between(from: 0, to: 8))
  liking_users.each do |user|
    Like.create!(
      user: user,
      post: post,
      created_at: Faker::Time.between(from: post.created_at, to: Time.current)
    )
  end
end

puts ""
puts "Community data created successfully!"
puts "Created:"
puts "  #{Post.count} posts"
puts "  #{Comment.count} comments"
puts "  #{Like.count} likes"
puts ""
puts "Post types:"
Post.group(:post_type).count.each do |type, count|
  puts "  #{type.capitalize}: #{count}"
end
