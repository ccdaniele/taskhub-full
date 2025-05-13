class UpdateProjectTaskResourceSchema < ActiveRecord::Migration[7.0]
  def change
    # --- Project changes ---
    rename_column :projects, :finish, :ending_at
    add_column :projects, :status, :string
    add_column :projects, :deadline, :string
    add_column :projects, :spent, :integer

    # --- Task changes ---
    rename_column :tasks, :finish, :ending_at
    add_column :tasks, :spent, :integer
    add_column :tasks, :status, :string

    # --- Resource changes ---
    # status already exists — do not add it again if you just want to keep it
    # But if you want to make sure it's there and correct:
    change_column :resources, :status, :string
  end
end
