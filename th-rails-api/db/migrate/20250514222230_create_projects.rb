class CreateProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.string :name
      t.integer :time
      t.integer :budget
      t.date :starting_at
      t.date :ending_at
      t.string :status
      t.string :deadline
      t.integer :spent
      t.boolean :public

      t.timestamps
    end
  end
end
