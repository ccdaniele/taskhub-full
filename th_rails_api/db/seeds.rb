## For CSV

# require 'smarter_csv' 

# file='../barkito_server/db/lic_db.csv'

# options = {}
# SmarterCSV.process(file, options) do |chunk|
#   chunk.each do |data_hash|
#     Vendor.create!( data_hash )
#   end
# end


## For Faker

require 'faker'


5.times do 
    User.create(username:Faker::Name, email:Faker::Internet.email, password:"12345")
end

10.times do 
    Project.create(name:Faker::Hobby.activity, time: 67, budget:Faker::Number.within(range: 10..1000),  starting_at:Faker::Time.between(from: DateTime.now - 1, to: DateTime.now, format: :default), ending_at:Faker::Time.between(from: DateTime.now - 1, to: DateTime.now, format: :default), public:Faker::Boolean.boolean, spent:Faker::Number.within(range: 10..1000), status:"pending", deadline:Faker::Time.between(from: DateTime.now - 1, to: DateTime.now, format: :default))
end

20.times do 
    Task.create(name:Faker::ElectricalComponents.electromechanical, time:Faker::Time.between(from: DateTime.now - 1, to: DateTime.now, format: :default), cost:Faker::Number.within(range: 1..500), ending_at:Faker::Time.between(from: DateTime.now - 1, to: DateTime.now, format: :default), public:Faker::Boolean.boolean, spent:Faker::Number.within(range: 10..1000), status:"pending")
end

30.times do 
    Resource.create(name:Faker::Hobby.activity, price:Faker::Number.within(range: 1..500), source:Faker::Internet.domain_name)
end

20.times do 
    Tag.create(name:Faker::ElectricalComponents.active)
end

10.times do 
    UsersProjects.create(user_id:Faker::Number.within(range: 1..5), project_id:Faker::Number.within(range: 1..10))
end


10.times do 
    UsersResources.create(user_id:Faker::Number.within(range: 1..5), resource_id:Faker::Number.within(range: 1..15))
end

10.times do 
    UsersTasks.create(user_id:Faker::Number.within(range: 1..5), task_id:Faker::Number.within(range: 1..15))
end

10.times do 
    ProjectsTask.create(project_id:Faker::Number.within(range: 1..10), task_id:Faker::Number.within(range: 1..10))
end

10.times do 
    ProjectsResources.create(project_id:Faker::Number.within(range: 1..10), resource_id:Faker::Number.within(range: 1..10))
end

10.times do 
    ProjectsTags.create(project_id:Faker::Number.within(range: 1..10), tag_id:Faker::Number.within(range: 1..10))
end

10.times do 
    TasksResources.create(resource_id:Faker::Number.within(range: 1..10), task_id:Faker::Number.within(range: 1..10))
end

10.times do 
    TasksTags.create(tag_id:Faker::Number.within(range: 1..10), task_id:Faker::Number.within(range: 1..10))
end

10.times do 
    ResourcesTags.create(resource_id:Faker::Number.within(range: 1..10), tag_id:Faker::Number.within(range: 1..10))
end
