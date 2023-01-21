# hello.py

from pprint import pprint
import configparser
from flask import Flask
from venmo_api import Client

app = Flask(__name__)

@app.route("/")
def hello_world():
    search_users()
    return "Hello, World!"

def search_users():
    venmo = get_venmo_client()
    users = venmo.user.search_for_users(query="justin swartsel",
                                        limit=10)
    for user in users:
        pprint(vars(user))

@app.route("/bribes", methods=["POST"])
def post_bribes():
    bribe_judges()
    return "Success!"

def bribe_judges():
    judgeIds = get_config("VenmoUserIds").split(",")

    venmo = get_venmo_client()

    for judgeId in judgeIds:
        print(judgeId)
        # venmo.payment.send_money(1, "test1", judgeId)


def get_venmo_client():
    temp_token = get_access_token()
    venmo = Client(access_token=temp_token)
    return venmo

access_token = None

def get_access_token():
    
    temp_token = get_config("VenmoAccessToken")
    print(temp_token)

    if not temp_token is None:
        return temp_token
    
    global access_token

    venmo_password = get_config("VenmoPassword")

    if access_token is None:
        access_token = Client.get_access_token(username="alex.r.denton@gmail.com",
                                            password=venmo_password)
    return access_token

def get_config(configValue):
    config = configparser.ConfigParser()
    config.read("config.ini")
    return config["DEFAULT"][configValue]
