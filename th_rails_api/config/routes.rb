Rails.application.routes.draw do
  resources :project_tasks
  resources :project_tags
  resources :project_resources
  resources :projects
  resources :resource_tags
  resources :task_tags
  resources :task_resources
  resources :user_resources
  resources :user_tasks
  resources :user_projects
  resources :tags
  resources :resources
  resources :tasks
  resources :users
  get '/projects', to: 'projects#index'
  get '/tags', to: 'tags#index'
  get '/tags', to: 'tags#show'
  get '/users', to: 'users#index'
  post '/newproject', to: 'projects#create'
  post '/tags', to: 'tags#create'
  post '/login', to: 'auth#create'
  get '/profile', to: 'users#profile'
  get '/current_user', to: 'auth#show'
  patch '/projects', to: 'projects#update'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
