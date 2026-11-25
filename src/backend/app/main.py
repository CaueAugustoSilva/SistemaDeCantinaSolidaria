from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import usuario_controller
from app.controllers import vendedor_controller

app = FastAPI(
    title="API Cantina Solidária IFRJ",
    description="API REST para gestão de vitrine, encomendas e vendas da Cantina Solidária.",
    version="0.1.0"
)

# Libera requisições do Front-end React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restringir para a URL do front-end
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuario_controller.router)
app.include_router(vendedor_controller.router)

@app.get("/")
def health_check():
    return {"status": "online", "projeto": "Cantina Solidária IFRJ"}