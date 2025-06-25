Rails.application.routes.draw do
  # Core models
  resources :users, only: [:index, :show, :create, :update, :destroy]
  resources :projects, only: [:index, :show, :create, :update, :destroy]
  resources :tasks, only: [:index, :show, :create, :update, :destroy]
  resources :resources, only: [:index, :show, :create, :update, :destroy]
  resources :tags, only: [:index, :show, :create, :update, :destroy]

  # Join models
  resources :user_projects, only: [:index, :show, :create, :update, :destroy]
  resources :user_tasks, only: [:index, :show, :create, :update, :destroy]
  resources :user_resources, only: [:index, :show, :create, :update, :destroy]

  resources :project_tasks, only: [:index, :show, :create, :update, :destroy]
  resources :project_resources, only: [:index, :show, :create, :update, :destroy]
  resources :project_tags, only: [:index, :show, :create, :update, :destroy]

  resources :task_resources, only: [:index, :show, :create, :update, :destroy]
  resources :task_tags, only: [:index, :show, :create, :update, :destroy]
  resources :resource_tags, only: [:index, :show, :create, :update, :destroy]
end
