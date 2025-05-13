class CreateUsersTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :users_tasks do |t|
      t.integer :user_id
      t.integer :task_id

      t.timestamps
    end
  end
end
