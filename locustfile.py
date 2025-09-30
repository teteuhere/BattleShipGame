from locust import HttpUser, task, between

class GameUser(HttpUser):
      wait_time = between(1, 5)
      game_id = None
      player1_id = None
      player2_id = None

      def on_start(self):
            """
            Called when a Locust start before any task is scheduled.
            Creates a game and sets up player IDs for the test.
            """
            response = self.client.post("/api/games/", json={
                  "game_mode": "pvp",
                  "player1_name": "LoadTester1",
                  "player2_name": "LoadTester2"
            })
            if response.status_code == 201:
                  data = response.json()
                  self.game_id = data.get("id")
                  if data.get("players"):
                        self.player1_id = data["players"][0]["id"]
                        self.player2_id = data["players"][1]["id"]

      @task(1)
      def place_ships_and_fire(self):
            """
            A task that simulates a user placing ships and then firing shots.
            """
            if not all([self.game_id, self.player1_id, self.player2_id]):
                  return

            self.client.post(f"/api/games/{self.game_id}/place-ships/", json={
                  "player_id": self.player1_id,
                  "ships": [{"ship_type": "destroyer", "coordinates": [[0, 0], [0, 1]]}]
            })


            self.client.post(f"/api/games/{self.game_id}/place-ships/", json={
                  "player_id": self.player2_id,
                  "ships": [{"ship_type": "destroyer", "coordinates": [[5, 5], [5, 6]]}]
            })

            for i in range(5):
                  self.client.post(f"/api/games/{self.game_id}/fire/", json={
                  "player_id": self.player1_id,
                  "coordinates": [i, 0]
                  })
