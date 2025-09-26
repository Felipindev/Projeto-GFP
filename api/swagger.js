import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
openapi: '3.0.4',
    info: {
        title: 'API do Gestor Financeiro Pessoal',
        version: '1.0.0',
        description: `API para gerenciamento financeiro pessoal desenvolvida no curso Técnico de Desenvolvimento de Sistemas do SENAI`
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Servidor Local'
        },
        {
            url: 'http://192.168.0.237:3000',
            description: 'Servidor do Douglas'
        }
    ],
    tags: [
        {
            name: 'Usuarios',
            description: 'Rotas para cadastro, login, atualização e desativação de usuários'
        },
        {
            name: 'Categorias',
            description: 'Rotas para cadastro, leitura, atualização e desativação de categorias'
        },
        {
            name: 'Subcategorias',
            description: 'Rotas para cadastro, leitura, atualização e desativação de Subcategorias'
        },
        {
            name: 'Contas',
            description: 'Rotas para cadastro, leitura, atualização e desativação de contas'
        },
        {
            name: 'Transacoes',
            description: 'Rotas para cadastro, leitura, atualização e desativação de transacoes'
        },
        
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    paths: {
        '/usuarios': {
            post: {
                tags: ['Usuarios'],
                summary: 'Cadastrar novo usuário',
                description: 'Método utilizado para cadastrar novos usuários',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuário cadastrado com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Usuarios'],
                summary: 'Listar todos os usuários',
                description: 'Método utilizado para listar todos os usuários cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de usuários',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            }  
        },
        '/usuarios/{id_usuario}': {
            delete: {
                tags: ['Usuarios'],
                summary: 'Deletar (desativar) usuarios',
                description: 'Rota para desativar usuario',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id_usuario',
                        in: 'path', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Usuario desativado com sucesso'
                    },
                    '500': {
                        description: 'Erro ao desativar usuario!'
                    }
                }
            },
            get: {
                tags: ['Usuarios'],
                summary: 'listar usuarios por ID',
                description: 'Rota para listar o usuario pelo id',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id_usuario',
                        in: 'path', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Usuario encontrado com sucesso!',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'usuario não encontrado!'
                    }
                }
            },
            put: {
                tags: ['Usuarios'],
                summary: 'atualizar usuario',
                description: 'Rota para atualizar todos os campos de um usuario',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: {type: 'string', example: 'felipe'},
                                    email: { type: 'string', example: 'sesia@sesi.br' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: {type: 'string', example: 'admin'}
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'id_usuario',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ], responses: {
                    '200': {
                        description: 'Campo específico atualizado com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao atualizar campo especifico'
                    }
                }
            },
            patch: {
                tags: ['Usuarios'],
                summary: 'Atualizar um campo especifico do usuario',
                description: 'Rota para atualizar um campo especifico de um usuario',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome'],
                                properties: {
                                    nome: {type: 'string', example: 'felipe'},
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'id_usuario',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ], responses: {
                    '200': {
                        description: 'usuario atualizado com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao atualizar usuario'
                    }
                }
            },
        },
        '/usuarios/login': {
            post: {
                tags: ['Usuarios'],
                summary: 'Login do usuário',
                description: 'Método utilizado para efetuar o login do usuário e gerar o token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'senha'],
                                properties: {
                                    email: { type: 'string', example: 'sesia@sesi.br' },
                                    senha: { type: 'string', example: '123' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuário encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            token: { type: 'string', example: 'jkdnaskjdbaskjndlaksnmmlmcaj21lekn1lkn213n12jb3kj 21' },
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Erro ao encontrar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
        },
        '/usuarios/filtrarNome': {
            get:{
                tags: ['Usuarios'],
                summary: 'filtrar usuarios por nome',
                description: 'Rota para filtrar todos o usuario pelas suas respectivas letras',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'nome',
                        in: 'query', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Usuario encontrado com sucesso!',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'usuario não encontrado!'
                    }
                }
            }
        },
        '/categorias': {
            post: {
                tags: ['Categorias'],
                summary: 'Nova Categoria',
                description: 'Rota para cadastrar nova categoria',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario', 'cor', 'icone'],
                                properties: {
                                    nome: {type: 'string', example: 'Alimentacao'},
                                    tipo_transacao: {type: 'string', example: 'ENTRADA'},
                                    gasto_fixo: {type: 'boolean', example: true},
                                    id_usuario: {type: 'integer', example: 1},
                                    cor: {type: 'string', example: '#008080'},
                                    icone: {type: 'string', example: 'save'}
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Categoria Cadastrada com sucesso!'
                    },
                    '400': {
                        description: 'Erro ao cadastrar categoria'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Categorias'],
                summary: 'Listar todos as categorias',
                description: 'Método utilizado para listar todos as categorias cadastradas',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de categorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_categoria: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            tipo_transacao: { type: 'string', example: 'ENTRADA' },
                                            gasto_fixo: { type: 'boolean', example: true },
                                            ativo: { type: 'boolean', example: true },
                                            id_usuario: { type: 'integer', example: 1 },
                                            cor: { type: 'string', example: "#008" },  
                                            icone: { type: 'string', example: "add" },  
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            }

        },
        '/categorias/{id_categoria}': {
             delete: {
                tags: ['Categorias'],
                summary: 'Deletar (desativar) categorias',
                description: 'Rota para desativar categoria',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id_categoria',
                        in: 'path', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'categoria desativada com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao desativar categoria!'
                    }
                }
            },
            get: {
                tags: ['Categorias'],
                summary: 'listar Categorias por ID',
                description: 'Rota para listar a categoria pelo id',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id_categoria',
                        in: 'path', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'categoria encontrada com sucesso!',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_categoria: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            tipo_transacao: { type: 'string', example: 'ENTRADA' },
                                            gasto_fixo: { type: 'boolean', example: true },
                                            ativo: { type: 'boolean', example: true },
                                            id_usuario: { type: 'integer', example: 1 },
                                            cor: { type: 'string', example: "#008" },  
                                            icone: { type: 'string', example: "add" },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'categoria não encontrada!'
                    }
                }
            },
            put: {
                tags: ['Categorias'],
                summary: 'atualizar categoria',
                description: 'Rota para atualizar todos os campos de uma categoria',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'ativo', 'id_usuario', 'cor', 'icone'],
                                properties: {
                                    nome: { type: 'string', example: 'Tetê' },
                                    tipo_transacao: { type: 'string', example: 'SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    ativo: { type: 'boolean', example: true },
                                    id_usuario: { type: 'integer', example: 16 },
                                    cor: { type: 'string', example: "#008" },  
                                    icone: { type: 'string', example: "add" },
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'id_categoria',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ], responses: {
                    '200': {
                        description: 'Campo específico atualizado com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao atualizar campo especifico'
                    }
                }
            },
            patch: {
                tags: ['Categorias'],
                summary: 'Atualizar um campo especifico da categoria',
                description: 'Rota para atualizar um campo especifico de uma categoria',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome'],
                                properties: {
                                    nome: {type: 'string', example: 'TETÊ'},
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'id_categoria',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ], responses: {
                    '200': {
                        description: 'categoria atualizada com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao atualizar categoria'
                    }
                }
            },
        },
        '/categorias/filtrarCategoria': {
            get:{
                tags: ['Categorias'],
                summary: 'filtrar categorias por tipo_transacao',
                description: 'Rota para filtrar todas as categorias por ENTRADA ou SAIDA',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'tipo_transacao',
                        in: 'query', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'categoria encontrada com sucesso!',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            nome: { type: 'string', example: 'Tetê' },
                                            tipo_transacao: { type: 'string', example: 'SAIDA' },
                                            gasto_fixo: { type: 'boolean', example: true },
                                            ativo: { type: 'boolean', example: true },
                                            id_usuario: { type: 'integer', example: 16 },
                                            cor: { type: 'string', example: "#008" },  
                                            icone: { type: 'string', example: "add" },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'categoria não encontrada!'
                    }
                }
            }
        },
        '/subCategorias': {
            post: {
                tags: ['Subcategorias'],
                summary: 'Nova Subcategoria',
                description: 'Rota para cadastrar nova subcategoria',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'id_categoria', 'gasto_fixo', 'ativo', 'cor', 'icone'],
                                properties: {
                                    nome: {type: 'string', example: 'Alimentacao do mercado'},
                                    id_categoria: {type: 'integer', example: 11},
                                    gasto_fixo: {type: 'boolean', example: true},
                                    ativo: {type: 'boolean', example: true},
                                    cor: {type: 'string', example: '#008080'},
                                    icone: {type: 'string', example: 'save'}
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'subCategoria Cadastrada com sucesso!'
                    },
                    '400': {
                        description: 'Erro ao cadastrar subcategoria'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Subcategorias'],
                summary: 'Listar todos as subcategorias',
                description: 'Método utilizado para listar todos as subcategorias cadastradas',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de subcategorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_subcategoria: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            id_categoria: { type: 'integer', example: 5 },
                                            gasto_fixo: { type: 'boolean', example: true },
                                            ativo: { type: 'boolean', example: true },
                                            cor: { type: 'string', example: "#008" },  
                                            icone: { type: 'string', example: "add" },  
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            }

        },
        '/subCategorias/{id_subCategoria}': {
             delete: {
                tags: ['Subcategorias'],
                summary: 'Deletar (desativar) Subcategorias',
                description: 'Rota para desativar Subcategoria',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id_subCategoria',
                        in: 'path', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'subcategoria desativada com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao desativar subcategoria!'
                    }
                }
            },
            get: {
                tags: ['Subcategorias'],
                summary: 'listar subCategorias por ID',
                description: 'Rota para listar a subcategoria pelo id',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id_subCategoria',
                        in: 'path', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'subcategoria encontrada com sucesso!',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_subcategoria: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            id_categoria: { type: 'integer', example: 5 },
                                            gasto_fixo: { type: 'boolean', example: true },
                                            ativo: { type: 'boolean', example: true },
                                            cor: { type: 'string', example: "#008" },  
                                            icone: { type: 'string', example: "add" },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'subcategorias não encontrado!'
                    }
                }
            },
            put: {
                tags: ['Subcategorias'],
                summary: 'atualizar subcategoria',
                description: 'Rota para atualizar todos os campos de uma subcategoria',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'id_categoria', 'gasto_fixo', 'ativo', 'cor', 'icone'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    id_categoria: { type: 'integer', example: 11 },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    ativo: { type: 'boolean', example: true },
                                    cor: { type: 'string', example: "#008" },  
                                    icone: { type: 'string', example: "add" },
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'id_subCategoria',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ], responses: {
                    '200': {
                        description: 'Campo específico atualizado com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao atualizar campo especifico'
                    }
                }
            },
            patch: {
                tags: ['Subcategorias'],
                summary: 'Atualizar um campo especifico da subcategoria',
                description: 'Rota para atualizar um campo especifico de uma subcategoria',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome'],
                                properties: {
                                    nome: {type: 'string', example: 'teste12'},
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'id_subCategoria',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ], responses: {
                    '200': {
                        description: 'subcategoria atualizada com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao atualizar subcategoria'
                    }
                }
            },
        },
        '/subCategorias/filtrarNome': {
            get:{
                tags: ['Subcategorias'],
                summary: 'filtrar subcategorias por nome',
                description: 'Rota para filtrar todas as subcategorias por suas respectivas letras',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'nome',
                        in: 'query', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'subcategoria encontrada com sucesso!',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            nome: { type: 'string', example: 'João Silva' },
                                            id_categoria: { type: 'integer', example: 5 },
                                            gasto_fixo: { type: 'boolean', example: true },
                                            ativo: { type: 'boolean', example: true },
                                            cor: { type: 'string', example: "#008" },  
                                            icone: { type: 'string', example: "add" },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'subcategoria não encontrada!'
                    }
                }
            }
        },
        ////////////////////////////////////////////////////////////////////////
        '/contas': {
            post: {
                tags: ['Contas'],
                summary: 'Nova conta',
                description: 'Rota para cadastrar nova conta',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_conta', 'saldo', 'ativo', 'conta_padrao'],
                                properties: {
                                    nome: {type: 'string', example: 'Felipe'},
                                    tipo_conta: {type: 'string', example: 'corrente'},
                                    saldo: {type: 'integer', example: 0},
                                    ativo: {type: 'boolean', example: true},
                                    conta_padrao: {type: 'boolean', example: true},
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'conta Cadastrada com sucesso!'
                    },
                    '400': {
                        description: 'Erro ao cadastrar conta'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Contas'],
                summary: 'Listar todas as contas',
                description: 'Método utilizado para listar todas as contas cadastradas',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de contas',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_conta: { type: 'integer', example: 1 },
                                            nome: {type: 'string', example: 'Felipe'},
                                            tipo_conta: {type: 'string', example: 'corrente'},
                                            saldo: {type: 'integer', example: 0},
                                            ativo: {type: 'boolean', example: true},
                                            conta_padrao: {type: 'boolean', example: true},  
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            }

        },
        '/contas/{id_conta}': {
             delete: {
                tags: ['Contas'],
                summary: 'Deletar (desativar) Contas',
                description: 'Rota para desativar Conta',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id_conta',
                        in: 'path', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'conta desativada com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao desativar conta!'
                    }
                }
            },
            get: {
                tags: ['Contas'],
                summary: 'listar contas por ID',
                description: 'Rota para listar a conta pelo id',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'id_conta',
                        in: 'path', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'conta encontrada com sucesso!',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_conta: { type: 'integer', example: 1 },
                                            nome: {type: 'string', example: 'Felipe'},
                                            tipo_conta: {type: 'string', example: 'corrente'},
                                            saldo: {type: 'integer', example: 0},
                                            ativo: {type: 'boolean', example: true},
                                            conta_padrao: {type: 'boolean', example: true},
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'conta não encontrada!'
                    }
                }
            },
            put: {
                tags: ['Contas'],
                summary: 'atualizar contas',
                description: 'Rota para atualizar todos os campos de uma contas',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_conta', 'saldo', 'ativo', 'conta_padrao'],
                                properties: {
                                    nome: {type: 'string', example: 'Felipe'},
                                    tipo_conta: {type: 'string', example: 'corrente'},
                                    saldo: {type: 'integer', example: 0},
                                    ativo: {type: 'boolean', example: true},
                                    conta_padrao: {type: 'boolean', example: true},
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'id_conta',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ], responses: {
                    '200': {
                        description: 'dados atualizados com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao atualizar dados'
                    }
                }
            },
            patch: {
                tags: ['Contas'],
                summary: 'Atualizar um campo especifico da conta',
                description: 'Rota para atualizar um campo especifico de uma conta',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome'],
                                properties: {
                                    nome: {type: 'string', example: 'ITI ITAU'},
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'id_conta',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ], responses: {
                    '200': {
                        description: 'conta atualizada com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao atualizar conta'
                    }
                }
            },
        },
        '/contas/filtrarContas': {
            get:{
                tags: ['Contas'],
                summary: 'filtrar contas por nome',
                description: 'Rota para filtrar todas as contas por suas respectivas letras',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                parameters: [
                    {
                        name: 'nome',
                        in: 'query', // caso queira passar como query; in: 'query'
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'conta encontrada com sucesso!',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_conta: { type: 'integer', example: 1 },
                                            nome: {type: 'string', example: 'Felipe'},
                                            tipo_conta: {type: 'string', example: 'corrente'},
                                            saldo: {type: 'integer', example: 0},
                                            ativo: {type: 'boolean', example: true},
                                            conta_padrao: {type: 'boolean', example: true},
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'conta não encontrada!'
                    }
                }
            }
        },
        '/transacao': {
            post: {
                tags: ['Transacoes'],
                summary: 'Cadastrar nova transacao',
                description: 'Rota para cadastrar uma nova transacao',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['valor', 'descricao', 'data_transacao', 'data_vencimento', 'data_pagamento', 'tipo_transacao', 'id_conta', 'id_categoria', 'id_subcategoria', 'id_usuario', 'num_parcelas', 'parcela_atual'],
                                properties: {
                                    valor: {type: 'integer', example: 100},
                                    descricao: {type: 'string', example: 'Compra de roupas'},
                                    data_transacao: {type: 'string', example: '2023-03-23'},
                                    data_vencimento: {type: 'string', example: '2023-03-23'},
                                    tipo_transacao: {type: 'string', example: 'entrada'},
                                    id_conta: {type: 'integer', example: 1},
                                    id_categoria: {type: 'integer', example: 1},
                                    id_subcategoria: {type: 'integer', example: 1},
                                    id_usuario: {type: 'integer', example: 1},
                                    num_parcelas: {type: 'integer', example: 1},
                                    parcela_atual: {type: 'integer', example: 1},
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'transacao cadastrada com sucesso!'
                    },
                    '500': {
                        description: 'Erro ao cadastrar transacao'
                    }
                }
            },
            get: {
                tags: ['Transacoes'],
                summary: 'Listar todas as transacoes',
                description: 'Método utilizado para listar todas as transacoes cadastradas',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                responses: {
                    '200': {
                        description: 'Lista de transacoes',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_transacao: { type: 'integer', example: 1 },
                                            valor: {type: 'integer', example: 100},
                                            descricao: {type: 'string', example: 'Compra de roupas'},
                                            data_transacao: {type: 'string', example: '2023-03-23'},
                                            data_vencimento: {type: 'string', example: '2023-03-23'},
                                            data_pagamento: {type: 'string', example: '2023-03-23'},
                                            tipo_transacao: {type: 'string', example: 'entrada'},
                                            num_parcelas: {type: 'integer', example: 1},
                                            parcela_atual: {type: 'integer', example: 1},
                                            nome_conta: {type: 'integer', example: 1},
                                            nome_categoria: {type: 'integer', example: 1},
                                            nome_subcategoria: {type: 'integer', example: 1},
                                            nome_usuario: {type: 'integer', example: 1},
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }

            },
            put: {
                tags: ['Transacoes'],
                summary: 'Atualizar transacao',
                description: 'Rota para atualizar todos os campos de uma transacao',
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['valor', 'descricao', 'data_transacao', 'data_vencimento', 'data_pagamento', 'tipo_transacao', 'id_conta', 'id_categoria', 'id_subcategoria', 'id_usuario', 'num_parcelas', 'parcela_atual'],
                                properties: {
                                    valor: {type: 'integer', example: 100},
                                    descricao: {type: 'string', example: 'Compra de roupas'},
                                    data_transacao: {type: 'string', example: '2023-03-23'},
                                    data_vencimento: {type: 'string', example: '2023-03-23'},
                                    data_pagamento: {type: 'string', example: '2023-03-23'},
                                    tipo_transacao: {type: 'string', example: 'entrada'},
                                    num_parcelas: {type: 'integer', example: 1},
                                    parcela_atual: {type: 'integer', example: 1},
                                    id_conta: {type: 'integer', example: 1},
                                    id_categoria: {type: 'integer', example: 1},
                                    id_subcategoria: {type: 'integer', example: 1},
                                    id_usuario: {type: 'integer', example: 1},
                                }
                            }
                        }
                    }
                },
                parameters: [
                    {
                        name: 'id_transacao',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ], responses: {
                    '200': {
                        description: 'dados atualizados com sucesso!'
                    },
                    '404': {
                        description: 'Not Found'
                    },
                    '500': {
                        description: 'Erro ao atualizar dados'
                    }
                }
            },
            

            
        }
    }
}

const options ={
    swaggerDefinition,
    apis: [] //
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;