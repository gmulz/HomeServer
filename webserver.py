from flask import Flask, request, jsonify, render_template
import json
import flask
import os
from flask_cors import CORS
from static.kitchen_app.server.server import *
from static.budget_app.server.budget_track_backend import *
from static.project_app.server.server import *


app = Flask(__name__, static_url_path="", static_folder="static", template_folder="static")
CORS(app)


@app.route('/kitchen_app')
def show_kitchen():
  return render_template('kitchen_app/dist/index.html')

@app.route('/foods', methods=['POST', 'GET'])
def food():
  return process_kitchen_model()


@app.route('/budget_app')
def show_budget():
  return render_template('budget_app/build/index.html')


@app.route('/budget', methods=['POST', 'GET'])
def budget():
  return process_budget_model()

@app.route('/projects', methods=['POST', 'GET'])
def projects():
  return process_project_model()

@app.route('/project_app')
def show_projects():
  return render_template('project_app/dist/index.html')


if __name__ == '__main__':
  app.run(host='127.0.0.1', port=4000)