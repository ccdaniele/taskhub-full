class CreateProjects < ActiveRecord::Migration[7.0]
  def change
    create_table :projects do |t|
      t.string :name
      t.integer :time
      t.integer :budget
      t.date :starting_at
      t.date :finish
      t.boolean :public

      t.timestamps
    end
  end
end
