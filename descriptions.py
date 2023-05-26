description = """

## Artgeist Raporty Front:\n
* **http://10.60.5.29/3333**

## Artgeist RAPORTY API.\n
### Raports:
* **read raports**\n
* **create raports**\n
* **update raports**\n
* **delete raports**\n
* **show user raports**\n
* **search raports**\n
* **show statistics**\n

### Authorization
* **register new user**\n
* **login**\n
* **reset password**\n
* **delete raports**\n

### How to Authorize
* **if not: register first**\n
* **login**\n
* **in "Response body" copy "access_token"**\n
* **get into "Authorize" green button / paste copied token / push "Authorize" / push "Close"**\n
* **now you have access to test endpoints**\n

"""

tags_metadata = [
    {
        "name": "Raports",
        "description": "Operations with DUR Raports.",
    },
    {
        "name": "Auth",
        "description": "Operations with Authorization.",
    },
]