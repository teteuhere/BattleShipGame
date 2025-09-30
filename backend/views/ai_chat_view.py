from rest_framework.views import APIView
from rest_framework.response import Response
import requests
import json

# Este é o nosso canal direto com o assistente de IA!
# Ele lida com as mensagens do usuário e envia tudo para o Ollama para uma resposta.

class AIChatView(APIView):
    def post(self, request, *args, **kwargs):
        user_message = request.data.get('message')

        if not user_message:
            return Response({"error": "Message is required."}, status=400)

        try:
            ollama_url = "http://ollama:11434/api/generate"
            prompt = (
                f"Você é um assistente prestativo e amigável, pronto para conversar "
                f"sobre o jogo Batalha Naval ou qualquer outro assunto. Por favor, "
                f"responda sempre em português. Aqui está a mensagem do usuário:\n\n{user_message}"
            )
            
            payload = {
                "model": "gemma:2b",
                "prompt": prompt,
                "stream": False,
            }
            
            response = requests.post(ollama_url, json=payload, timeout=60)
            response.raise_for_status()

            response_data = response.json()
            ai_response = response_data.get('response', "Desculpe, estou com problemas para responder agora.")

            return Response({"response": ai_response})

        except requests.exceptions.RequestException as e:
            return Response({"error": f"Não foi possível conectar ao serviço de IA: {e}"}, status=500)
        except json.JSONDecodeError:
            return Response({"error": "A IA retornou uma resposta que não era válida."}, status=500)
        except Exception as e:
            return Response({"error": str(e)}, status=500)