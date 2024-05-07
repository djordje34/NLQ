import json
from flask import Flask, Response, jsonify, request
from flask_cors import CORS, cross_origin
import sqlite3
import os
from werkzeug.exceptions import BadRequest, InternalServerError
from wrapper.db import Database
from wrapper.model import Model
from wrapper.chaingen import ChainGen
from utility.prompts import Prompt
from utility.utils import adopt_childfile

# in case this becomes a module