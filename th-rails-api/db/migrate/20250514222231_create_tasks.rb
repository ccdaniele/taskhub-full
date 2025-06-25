class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :name
      t.integer :time
      t.integer :cost
      t.date :ending_at
      t.string :status
      t.integer :spent
      t.boolean :public
      t.date :starting_at

      t.timestamps
    end
  end
end
