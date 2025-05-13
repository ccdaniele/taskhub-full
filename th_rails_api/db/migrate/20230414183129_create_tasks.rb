class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.string :name
      t.integer :time
      t.integer :cost
      t.boolean :public
      t.date :starting_at
      t.date :finish

      t.timestamps
    end
  end
end
