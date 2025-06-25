# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_14_222250) do
  create_table "project_resources", force: :cascade do |t|
    t.integer "project_id", null: false
    t.integer "resource_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_project_resources_on_project_id"
    t.index ["resource_id"], name: "index_project_resources_on_resource_id"
  end

  create_table "project_tags", force: :cascade do |t|
    t.integer "project_id", null: false
    t.integer "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_project_tags_on_project_id"
    t.index ["tag_id"], name: "index_project_tags_on_tag_id"
  end

  create_table "project_tasks", force: :cascade do |t|
    t.integer "project_id", null: false
    t.integer "task_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_project_tasks_on_project_id"
    t.index ["task_id"], name: "index_project_tasks_on_task_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.integer "time"
    t.integer "budget"
    t.date "starting_at"
    t.date "ending_at"
    t.string "status"
    t.string "deadline"
    t.integer "spent"
    t.boolean "public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "resource_tags", force: :cascade do |t|
    t.integer "resource_id", null: false
    t.integer "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resource_id"], name: "index_resource_tags_on_resource_id"
    t.index ["tag_id"], name: "index_resource_tags_on_tag_id"
  end

  create_table "resources", force: :cascade do |t|
    t.string "name"
    t.integer "price"
    t.string "source"
    t.string "status"
    t.boolean "public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.boolean "public"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "task_resources", force: :cascade do |t|
    t.integer "task_id", null: false
    t.integer "resource_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resource_id"], name: "index_task_resources_on_resource_id"
    t.index ["task_id"], name: "index_task_resources_on_task_id"
  end

  create_table "task_tags", force: :cascade do |t|
    t.integer "task_id", null: false
    t.integer "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tag_id"], name: "index_task_tags_on_tag_id"
    t.index ["task_id"], name: "index_task_tags_on_task_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "name"
    t.integer "time"
    t.integer "cost"
    t.date "ending_at"
    t.string "status"
    t.integer "spent"
    t.boolean "public"
    t.date "starting_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_projects", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "project_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_user_projects_on_project_id"
    t.index ["user_id"], name: "index_user_projects_on_user_id"
  end

  create_table "user_resources", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "resource_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resource_id"], name: "index_user_resources_on_resource_id"
    t.index ["user_id"], name: "index_user_resources_on_user_id"
  end

  create_table "user_tasks", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "task_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_user_tasks_on_task_id"
    t.index ["user_id"], name: "index_user_tasks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.boolean "public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "project_resources", "projects"
  add_foreign_key "project_resources", "resources"
  add_foreign_key "project_tags", "projects"
  add_foreign_key "project_tags", "tags"
  add_foreign_key "project_tasks", "projects"
  add_foreign_key "project_tasks", "tasks"
  add_foreign_key "resource_tags", "resources"
  add_foreign_key "resource_tags", "tags"
  add_foreign_key "task_resources", "resources"
  add_foreign_key "task_resources", "tasks"
  add_foreign_key "task_tags", "tags"
  add_foreign_key "task_tags", "tasks"
  add_foreign_key "user_projects", "projects"
  add_foreign_key "user_projects", "users"
  add_foreign_key "user_resources", "resources"
  add_foreign_key "user_resources", "users"
  add_foreign_key "user_tasks", "tasks"
  add_foreign_key "user_tasks", "users"
end
