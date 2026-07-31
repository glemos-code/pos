BEGIN;

WITH candidates_payload AS (
  SELECT $$
[
    {
        "id":  1,
        "name":  "Marina Costa",
        "yearsExperience":  6,
        "seniority":  "mid",
        "skills":  [
                       "java",
                       "spring",
                       "kafka",
                       "sql"
                   ],
        "salaryExpectation":  9500
    },
    {
        "id":  2,
        "name":  "Carlos Mendes",
        "yearsExperience":  3,
        "seniority":  "junior",
        "skills":  [
                       "javascript",
                       "react",
                       "sql"
                   ],
        "salaryExpectation":  6200
    },
    {
        "id":  3,
        "name":  "Ana Pereira",
        "yearsExperience":  9,
        "seniority":  "senior",
        "skills":  [
                       "java",
                       "spring",
                       "docker",
                       "kafka",
                       "aws"
                   ],
        "salaryExpectation":  13500
    },
    {
        "id":  4,
        "name":  "Bruno Silva",
        "yearsExperience":  4,
        "seniority":  "mid",
        "skills":  [
                       "python",
                       "sql",
                       "docker"
                   ],
        "salaryExpectation":  7800
    },
    {
        "id":  5,
        "name":  "Fernanda Rocha",
        "yearsExperience":  5,
        "seniority":  "mid",
        "skills":  [
                       "java",
                       "spring",
                       "sql",
                       "docker"
                   ],
        "salaryExpectation":  10200
    },
    {
        "id":  6,
        "name":  "Eduardo Souza",
        "yearsExperience":  11,
        "seniority":  "senior",
        "skills":  [
                       "go",
                       "aws",
                       "python"
                   ],
        "salaryExpectation":  13380
    },
    {
        "id":  7,
        "name":  "Vinicius Ribeiro",
        "yearsExperience":  4,
        "seniority":  "mid",
        "skills":  [
                       "redis",
                       "kafka",
                       "spring",
                       "aws",
                       "java"
                   ],
        "salaryExpectation":  8400
    },
    {
        "id":  8,
        "name":  "Carla Costa",
        "yearsExperience":  10,
        "seniority":  "senior",
        "skills":  [
                       "kubernetes",
                       "redis",
                       "aws"
                   ],
        "salaryExpectation":  14692
    },
    {
        "id":  9,
        "name":  "Otavio Rocha",
        "yearsExperience":  7,
        "seniority":  "mid",
        "skills":  [
                       "redis",
                       "node",
                       "spring"
                   ],
        "salaryExpectation":  10368
    },
    {
        "id":  10,
        "name":  "Paula Santos",
        "yearsExperience":  12,
        "seniority":  "senior",
        "skills":  [
                       "aws",
                       "docker",
                       "spring"
                   ],
        "salaryExpectation":  15203
    },
    {
        "id":  11,
        "name":  "Davi Rocha",
        "yearsExperience":  5,
        "seniority":  "mid",
        "skills":  [
                       "kubernetes",
                       "redis",
                       "sql",
                       "typescript",
                       "python"
                   ],
        "salaryExpectation":  9735
    },
    {
        "id":  12,
        "name":  "Vitor Barbosa",
        "yearsExperience":  4,
        "seniority":  "mid",
        "skills":  [
                       "java",
                       "python",
                       "postgresql"
                   ],
        "salaryExpectation":  10184
    },
    {
        "id":  13,
        "name":  "Patricia Souza",
        "yearsExperience":  1,
        "seniority":  "junior",
        "skills":  [
                       "spring",
                       "javascript",
                       "react"
                   ],
        "salaryExpectation":  6538
    },
    {
        "id":  14,
        "name":  "Monica Pereira",
        "yearsExperience":  10,
        "seniority":  "senior",
        "skills":  [
                       "postgresql",
                       "node",
                       "java",
                       "redis",
                       "docker"
                   ],
        "salaryExpectation":  14744
    },
    {
        "id":  15,
        "name":  "Gabriela Rocha",
        "yearsExperience":  7,
        "seniority":  "mid",
        "skills":  [
                       "aws",
                       "kubernetes",
                       "spring"
                   ],
        "salaryExpectation":  10058
    },
    {
        "id":  16,
        "name":  "Davi Almeida",
        "yearsExperience":  11,
        "seniority":  "senior",
        "skills":  [
                       "typescript",
                       "kubernetes",
                       "java",
                       "sql",
                       "node"
                   ],
        "salaryExpectation":  14459
    },
    {
        "id":  17,
        "name":  "Andre Silva",
        "yearsExperience":  9,
        "seniority":  "senior",
        "skills":  [
                       "go",
                       "typescript",
                       "redis",
                       "kubernetes",
                       "aws"
                   ],
        "salaryExpectation":  14313
    },
    {
        "id":  18,
        "name":  "Joao Teixeira",
        "yearsExperience":  7,
        "seniority":  "mid",
        "skills":  [
                       "typescript",
                       "kafka",
                       "postgresql",
                       "spring",
                       "docker"
                   ],
        "salaryExpectation":  9879
    },
    {
        "id":  19,
        "name":  "Andre Ribeiro",
        "yearsExperience":  7,
        "seniority":  "mid",
        "skills":  [
                       "java",
                       "docker",
                       "kafka",
                       "aws"
                   ],
        "salaryExpectation":  8559
    },
    {
        "id":  20,
        "name":  "Diego Pereira",
        "yearsExperience":  2,
        "seniority":  "junior",
        "skills":  [
                       "javascript",
                       "kafka",
                       "aws",
                       "node",
                       "redis"
                   ],
        "salaryExpectation":  6043
    },
    {
        "id":  21,
        "name":  "Vitor Costa",
        "yearsExperience":  8,
        "seniority":  "senior",
        "skills":  [
                       "kubernetes",
                       "aws",
                       "docker",
                       "react",
                       "node"
                   ],
        "salaryExpectation":  14499
    },
    {
        "id":  22,
        "name":  "Davi Santos",
        "yearsExperience":  7,
        "seniority":  "mid",
        "skills":  [
                       "redis",
                       "typescript",
                       "postgresql",
                       "docker"
                   ],
        "salaryExpectation":  9956
    },
    {
        "id":  23,
        "name":  "Gabriela Moreira",
        "yearsExperience":  11,
        "seniority":  "senior",
        "skills":  [
                       "java",
                       "postgresql",
                       "go",
                       "redis",
                       "node"
                   ],
        "salaryExpectation":  13858
    },
    {
        "id":  24,
        "name":  "Carla Almeida",
        "yearsExperience":  10,
        "seniority":  "senior",
        "skills":  [
                       "redis",
                       "spring",
                       "react",
                       "python"
                   ],
        "salaryExpectation":  13968
    },
    {
        "id":  25,
        "name":  "Patricia Moreira",
        "yearsExperience":  2,
        "seniority":  "junior",
        "skills":  [
                       "node",
                       "docker",
                       "sql",
                       "postgresql"
                   ],
        "salaryExpectation":  5858
    },
    {
        "id":  26,
        "name":  "Carla Gomes",
        "yearsExperience":  9,
        "seniority":  "senior",
        "skills":  [
                       "aws",
                       "kubernetes",
                       "node",
                       "java",
                       "javascript"
                   ],
        "salaryExpectation":  13599
    },
    {
        "id":  27,
        "name":  "Felipe Ribeiro",
        "yearsExperience":  3,
        "seniority":  "junior",
        "skills":  [
                       "typescript",
                       "kubernetes",
                       "react",
                       "sql"
                   ],
        "salaryExpectation":  5425
    },
    {
        "id":  28,
        "name":  "Livia Cardoso",
        "yearsExperience":  11,
        "seniority":  "senior",
        "skills":  [
                       "docker",
                       "redis",
                       "postgresql",
                       "typescript",
                       "kubernetes"
                   ],
        "salaryExpectation":  13730
    },
    {
        "id":  29,
        "name":  "Gustavo Batista",
        "yearsExperience":  12,
        "seniority":  "senior",
        "skills":  [
                       "kubernetes",
                       "aws",
                       "react",
                       "docker",
                       "python"
                   ],
        "salaryExpectation":  13880
    },
    {
        "id":  30,
        "name":  "Yasmin Teixeira",
        "yearsExperience":  7,
        "seniority":  "mid",
        "skills":  [
                       "kubernetes",
                       "kafka",
                       "postgresql",
                       "sql",
                       "spring"
                   ],
        "salaryExpectation":  8889
    },
    {
        "id":  31,
        "name":  "Eduardo Silva",
        "yearsExperience":  11,
        "seniority":  "senior",
        "skills":  [
                       "redis",
                       "go",
                       "spring",
                       "react",
                       "python"
                   ],
        "salaryExpectation":  15211
    },
    {
        "id":  32,
        "name":  "Pedro Cardoso",
        "yearsExperience":  3,
        "seniority":  "junior",
        "skills":  [
                       "react",
                       "typescript",
                       "java",
                       "aws"
                   ],
        "salaryExpectation":  5249
    },
    {
        "id":  33,
        "name":  "Joao Mendes",
        "yearsExperience":  9,
        "seniority":  "senior",
        "skills":  [
                       "kafka",
                       "javascript",
                       "python",
                       "spring",
                       "java"
                   ],
        "salaryExpectation":  13337
    },
    {
        "id":  34,
        "name":  "Vinicius Oliveira",
        "yearsExperience":  5,
        "seniority":  "mid",
        "skills":  [
                       "sql",
                       "typescript",
                       "kafka"
                   ],
        "salaryExpectation":  8965
    },
    {
        "id":  35,
        "name":  "Lucas Moreira",
        "yearsExperience":  9,
        "seniority":  "senior",
        "skills":  [
                       "react",
                       "spring",
                       "kafka",
                       "docker",
                       "javascript"
                   ],
        "salaryExpectation":  13557
    },
    {
        "id":  36,
        "name":  "Yasmin Oliveira",
        "yearsExperience":  3,
        "seniority":  "junior",
        "skills":  [
                       "javascript",
                       "java",
                       "kubernetes",
                       "python"
                   ],
        "salaryExpectation":  6103
    },
    {
        "id":  37,
        "name":  "Carla Gomes",
        "yearsExperience":  11,
        "seniority":  "senior",
        "skills":  [
                       "typescript",
                       "python",
                       "java",
                       "kubernetes"
                   ],
        "salaryExpectation":  13693
    },
    {
        "id":  38,
        "name":  "Larissa Barbosa",
        "yearsExperience":  8,
        "seniority":  "senior",
        "skills":  [
                       "java",
                       "docker",
                       "spring",
                       "sql"
                   ],
        "salaryExpectation":  15087
    },
    {
        "id":  39,
        "name":  "Otavio Moreira",
        "yearsExperience":  4,
        "seniority":  "mid",
        "skills":  [
                       "kafka",
                       "kubernetes",
                       "react",
                       "go"
                   ],
        "salaryExpectation":  9797
    },
    {
        "id":  40,
        "name":  "Elaine Souza",
        "yearsExperience":  10,
        "seniority":  "senior",
        "skills":  [
                       "postgresql",
                       "aws",
                       "kafka",
                       "sql"
                   ],
        "salaryExpectation":  14126
    },
    {
        "id":  41,
        "name":  "Mayara Teixeira",
        "yearsExperience":  10,
        "seniority":  "senior",
        "skills":  [
                       "react",
                       "redis",
                       "spring"
                   ],
        "salaryExpectation":  13987
    },
    {
        "id":  42,
        "name":  "Leandro Costa",
        "yearsExperience":  3,
        "seniority":  "junior",
        "skills":  [
                       "typescript",
                       "redis",
                       "node",
                       "python",
                       "kafka"
                   ],
        "salaryExpectation":  6599
    },
    {
        "id":  43,
        "name":  "Gabriela Cardoso",
        "yearsExperience":  7,
        "seniority":  "mid",
        "skills":  [
                       "go",
                       "sql",
                       "javascript",
                       "aws"
                   ],
        "salaryExpectation":  8351
    },
    {
        "id":  44,
        "name":  "Caio Silva",
        "yearsExperience":  7,
        "seniority":  "mid",
        "skills":  [
                       "go",
                       "java",
                       "spring",
                       "node",
                       "typescript"
                   ],
        "salaryExpectation":  8412
    },
    {
        "id":  45,
        "name":  "Eduardo Silva",
        "yearsExperience":  12,
        "seniority":  "senior",
        "skills":  [
                       "go",
                       "spring",
                       "redis",
                       "python"
                   ],
        "salaryExpectation":  14891
    },
    {
        "id":  46,
        "name":  "Helena Cardoso",
        "yearsExperience":  10,
        "seniority":  "senior",
        "skills":  [
                       "go",
                       "sql",
                       "redis",
                       "docker",
                       "typescript"
                   ],
        "salaryExpectation":  14373
    },
    {
        "id":  47,
        "name":  "Davi Ferreira",
        "yearsExperience":  12,
        "seniority":  "senior",
        "skills":  [
                       "sql",
                       "react",
                       "aws"
                   ],
        "salaryExpectation":  14064
    },
    {
        "id":  48,
        "name":  "Renato Rocha",
        "yearsExperience":  7,
        "seniority":  "mid",
        "skills":  [
                       "postgresql",
                       "docker",
                       "typescript",
                       "python",
                       "redis"
                   ],
        "salaryExpectation":  10136
    },
    {
        "id":  49,
        "name":  "Joao Gomes",
        "yearsExperience":  2,
        "seniority":  "junior",
        "skills":  [
                       "typescript",
                       "aws",
                       "node",
                       "javascript",
                       "kubernetes"
                   ],
        "salaryExpectation":  5361
    },
    {
        "id":  50,
        "name":  "Eduardo Costa",
        "yearsExperience":  8,
        "seniority":  "senior",
        "skills":  [
                       "javascript",
                       "kafka",
                       "go",
                       "python"
                   ],
        "salaryExpectation":  14033
    }
]
$$::jsonb AS data
)
INSERT INTO public.candidates (id, metadata)
SELECT (candidate ->> 'id')::bigint, candidate
FROM candidates_payload,
LATERAL jsonb_array_elements(data) AS candidate
WHERE NOT EXISTS (
  SELECT 1 FROM public.candidates c WHERE c.id = (candidate ->> 'id')::bigint
);

WITH jobs_payload AS (
  SELECT $$
[
    {
        "id":  10,
        "title":  "Mid Backend Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "java",
                               "spring",
                               "docker"
                           ],
        "salaryRange":  [
                            8000,
                            11000
                        ]
    },
    {
        "id":  11,
        "title":  "Junior Frontend Developer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "javascript",
                               "react"
                           ],
        "salaryRange":  [
                            5000,
                            7000
                        ]
    },
    {
        "id":  12,
        "title":  "Senior Backend Architect",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "java",
                               "spring",
                               "aws",
                               "kafka"
                           ],
        "salaryRange":  [
                            14000,
                            18000
                        ]
    },
    {
        "id":  13,
        "title":  "Mid Frontend Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "kafka",
                               "python",
                               "postgresql",
                               "aws"
                           ],
        "salaryRange":  [
                            8570,
                            12051
                        ]
    },
    {
        "id":  14,
        "title":  "Junior Cloud Engineer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "go",
                               "python",
                               "sql",
                               "spring",
                               "node"
                           ],
        "salaryRange":  [
                            5340,
                            8171
                        ]
    },
    {
        "id":  15,
        "title":  "Junior Frontend Developer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "kafka",
                               "react",
                               "javascript"
                           ],
        "salaryRange":  [
                            5188,
                            7774
                        ]
    },
    {
        "id":  16,
        "title":  "Senior Integration Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "node",
                               "kafka",
                               "typescript"
                           ],
        "salaryRange":  [
                            14956,
                            16965
                        ]
    },
    {
        "id":  17,
        "title":  "Senior Integration Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "kubernetes",
                               "sql",
                               "react",
                               "node"
                           ],
        "salaryRange":  [
                            16113,
                            18528
                        ]
    },
    {
        "id":  18,
        "title":  "Mid Frontend Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "kubernetes",
                               "typescript",
                               "postgresql"
                           ],
        "salaryRange":  [
                            10804,
                            14496
                        ]
    },
    {
        "id":  19,
        "title":  "Mid Full Stack Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "java",
                               "redis",
                               "react",
                               "sql",
                               "node"
                           ],
        "salaryRange":  [
                            10025,
                            13405
                        ]
    },
    {
        "id":  20,
        "title":  "Mid Backend Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "python",
                               "typescript",
                               "react"
                           ],
        "salaryRange":  [
                            10679,
                            13272
                        ]
    },
    {
        "id":  21,
        "title":  "Senior Platform Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "typescript",
                               "javascript",
                               "sql",
                               "aws",
                               "spring"
                           ],
        "salaryRange":  [
                            15938,
                            19139
                        ]
    },
    {
        "id":  22,
        "title":  "Mid Application Architect",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "kafka",
                               "react",
                               "docker"
                           ],
        "salaryRange":  [
                            8281,
                            10497
                        ]
    },
    {
        "id":  23,
        "title":  "Mid Cloud Engineer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "sql",
                               "postgresql",
                               "redis",
                               "java",
                               "typescript"
                           ],
        "salaryRange":  [
                            9154,
                            13083
                        ]
    },
    {
        "id":  24,
        "title":  "Senior Full Stack Developer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "sql",
                               "docker",
                               "kafka",
                               "java",
                               "go"
                           ],
        "salaryRange":  [
                            14447,
                            16835
                        ]
    },
    {
        "id":  25,
        "title":  "Senior Cloud Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "redis",
                               "docker",
                               "python",
                               "go",
                               "spring"
                           ],
        "salaryRange":  [
                            13540,
                            17040
                        ]
    },
    {
        "id":  26,
        "title":  "Mid API Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "javascript",
                               "node",
                               "docker"
                           ],
        "salaryRange":  [
                            10847,
                            14322
                        ]
    },
    {
        "id":  27,
        "title":  "Senior Site Reliability Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "python",
                               "docker",
                               "kafka",
                               "react"
                           ],
        "salaryRange":  [
                            13698,
                            15481
                        ]
    },
    {
        "id":  28,
        "title":  "Senior Backend Developer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "sql",
                               "python",
                               "postgresql",
                               "spring",
                               "aws"
                           ],
        "salaryRange":  [
                            14705,
                            17846
                        ]
    },
    {
        "id":  29,
        "title":  "Mid ML Engineer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "go",
                               "node",
                               "redis",
                               "docker"
                           ],
        "salaryRange":  [
                            9888,
                            13732
                        ]
    },
    {
        "id":  30,
        "title":  "Mid Frontend Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "postgresql",
                               "kubernetes",
                               "python",
                               "java",
                               "aws"
                           ],
        "salaryRange":  [
                            10768,
                            12256
                        ]
    },
    {
        "id":  31,
        "title":  "Mid ML Engineer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "node",
                               "javascript",
                               "java",
                               "postgresql",
                               "spring"
                           ],
        "salaryRange":  [
                            9735,
                            12283
                        ]
    },
    {
        "id":  32,
        "title":  "Mid Site Reliability Engineer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "python",
                               "typescript",
                               "aws",
                               "docker"
                           ],
        "salaryRange":  [
                            8265,
                            10470
                        ]
    },
    {
        "id":  33,
        "title":  "Senior Software Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "sql",
                               "javascript",
                               "aws"
                           ],
        "salaryRange":  [
                            12178,
                            16016
                        ]
    },
    {
        "id":  34,
        "title":  "Mid Cloud Engineer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "java",
                               "go",
                               "typescript"
                           ],
        "salaryRange":  [
                            10821,
                            13069
                        ]
    },
    {
        "id":  35,
        "title":  "Mid Integration Engineer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "spring",
                               "kubernetes",
                               "java",
                               "node"
                           ],
        "salaryRange":  [
                            7838,
                            10559
                        ]
    },
    {
        "id":  36,
        "title":  "Junior Product Engineer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "java",
                               "go",
                               "node",
                               "aws"
                           ],
        "salaryRange":  [
                            6922,
                            8952
                        ]
    },
    {
        "id":  37,
        "title":  "Senior Backend Developer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "sql",
                               "kafka",
                               "typescript"
                           ],
        "salaryRange":  [
                            12373,
                            14132
                        ]
    },
    {
        "id":  38,
        "title":  "Senior Frontend Developer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "sql",
                               "kafka",
                               "python",
                               "postgresql",
                               "typescript"
                           ],
        "salaryRange":  [
                            16333,
                            18965
                        ]
    },
    {
        "id":  39,
        "title":  "Mid API Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "redis",
                               "react",
                               "node",
                               "spring"
                           ],
        "salaryRange":  [
                            7524,
                            10245
                        ]
    },
    {
        "id":  40,
        "title":  "Mid Frontend Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "javascript",
                               "docker",
                               "kubernetes",
                               "sql",
                               "typescript"
                           ],
        "salaryRange":  [
                            8845,
                            11045
                        ]
    },
    {
        "id":  41,
        "title":  "Senior Platform Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "javascript",
                               "kubernetes",
                               "react"
                           ],
        "salaryRange":  [
                            12586,
                            16301
                        ]
    },
    {
        "id":  42,
        "title":  "Junior Full Stack Developer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "redis",
                               "java",
                               "spring"
                           ],
        "salaryRange":  [
                            6997,
                            10667
                        ]
    },
    {
        "id":  43,
        "title":  "Senior Product Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "python",
                               "javascript",
                               "aws"
                           ],
        "salaryRange":  [
                            15494,
                            18744
                        ]
    },
    {
        "id":  44,
        "title":  "Junior API Developer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "aws",
                               "docker",
                               "kubernetes",
                               "python",
                               "go"
                           ],
        "salaryRange":  [
                            6487,
                            8923
                        ]
    },
    {
        "id":  45,
        "title":  "Junior API Developer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "java",
                               "typescript",
                               "aws",
                               "go",
                               "sql"
                           ],
        "salaryRange":  [
                            5521,
                            9061
                        ]
    },
    {
        "id":  46,
        "title":  "Junior Frontend Developer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "kafka",
                               "kubernetes",
                               "python",
                               "javascript"
                           ],
        "salaryRange":  [
                            6447,
                            8297
                        ]
    },
    {
        "id":  47,
        "title":  "Mid Full Stack Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "postgresql",
                               "sql",
                               "react"
                           ],
        "salaryRange":  [
                            10026,
                            13836
                        ]
    },
    {
        "id":  48,
        "title":  "Mid API Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "aws",
                               "typescript",
                               "postgresql",
                               "go",
                               "javascript"
                           ],
        "salaryRange":  [
                            8837,
                            10553
                        ]
    },
    {
        "id":  49,
        "title":  "Junior Cloud Engineer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "redis",
                               "python",
                               "aws",
                               "java",
                               "node"
                           ],
        "salaryRange":  [
                            5948,
                            8615
                        ]
    },
    {
        "id":  50,
        "title":  "Junior DevOps Engineer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "javascript",
                               "redis",
                               "kafka",
                               "docker",
                               "postgresql"
                           ],
        "salaryRange":  [
                            5136,
                            8699
                        ]
    },
    {
        "id":  51,
        "title":  "Mid Application Architect",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "typescript",
                               "kubernetes",
                               "postgresql"
                           ],
        "salaryRange":  [
                            8492,
                            10251
                        ]
    },
    {
        "id":  52,
        "title":  "Mid Backend Developer",
        "minimumSeniority":  "mid",
        "requiredSkills":  [
                               "redis",
                               "go",
                               "sql"
                           ],
        "salaryRange":  [
                            10870,
                            13349
                        ]
    },
    {
        "id":  53,
        "title":  "Senior Site Reliability Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "java",
                               "sql",
                               "aws"
                           ],
        "salaryRange":  [
                            15089,
                            18661
                        ]
    },
    {
        "id":  54,
        "title":  "Senior Data Engineer",
        "minimumSeniority":  "senior",
        "requiredSkills":  [
                               "redis",
                               "kubernetes",
                               "node",
                               "sql"
                           ],
        "salaryRange":  [
                            14371,
                            16931
                        ]
    },
    {
        "id":  55,
        "title":  "Junior Full Stack Developer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "sql",
                               "react",
                               "java",
                               "javascript"
                           ],
        "salaryRange":  [
                            5469,
                            6951
                        ]
    },
    {
        "id":  56,
        "title":  "Junior Tech Lead",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "go",
                               "java",
                               "docker",
                               "spring"
                           ],
        "salaryRange":  [
                            4927,
                            6988
                        ]
    },
    {
        "id":  57,
        "title":  "Junior Integration Engineer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "node",
                               "sql",
                               "docker",
                               "java",
                               "spring"
                           ],
        "salaryRange":  [
                            4721,
                            7711
                        ]
    },
    {
        "id":  58,
        "title":  "Junior Data Engineer",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "kafka",
                               "kubernetes",
                               "node",
                               "redis",
                               "python"
                           ],
        "salaryRange":  [
                            5541,
                            7438
                        ]
    },
    {
        "id":  59,
        "title":  "Junior Application Architect",
        "minimumSeniority":  "junior",
        "requiredSkills":  [
                               "aws",
                               "node",
                               "javascript"
                           ],
        "salaryRange":  [
                            6652,
                            8621
                        ]
    }
]
$$::jsonb AS data
)
INSERT INTO public.jobs (id, metadata)
SELECT (job ->> 'id')::bigint, job
FROM jobs_payload,
LATERAL jsonb_array_elements(data) AS job
WHERE NOT EXISTS (
  SELECT 1 FROM public.jobs j WHERE j.id = (job ->> 'id')::bigint
);

WITH history_payload AS (
  SELECT $$
[
  {
    "candidateId": 16,
    "jobId": 17,
    "label": 1
  },
  {
    "candidateId": 30,
    "jobId": 24,
    "label": 0
  },
  {
    "candidateId": 22,
    "jobId": 17,
    "label": 0
  },
  {
    "candidateId": 12,
    "jobId": 30,
    "label": 1
  },
  {
    "candidateId": 5,
    "jobId": 13,
    "label": 0
  },
  {
    "candidateId": 42,
    "jobId": 58,
    "label": 1
  },
  {
    "candidateId": 8,
    "jobId": 27,
    "label": 0
  },
  {
    "candidateId": 15,
    "jobId": 35,
    "label": 1
  },
  {
    "candidateId": 13,
    "jobId": 38,
    "label": 0
  },
  {
    "candidateId": 25,
    "jobId": 34,
    "label": 0
  },
  {
    "candidateId": 37,
    "jobId": 11,
    "label": 0
  },
  {
    "candidateId": 36,
    "jobId": 46,
    "label": 1
  },
  {
    "candidateId": 35,
    "jobId": 49,
    "label": 0
  },
  {
    "candidateId": 11,
    "jobId": 23,
    "label": 1
  },
  {
    "candidateId": 44,
    "jobId": 25,
    "label": 0
  },
  {
    "candidateId": 38,
    "jobId": 24,
    "label": 1
  },
  {
    "candidateId": 25,
    "jobId": 57,
    "label": 1
  },
  {
    "candidateId": 16,
    "jobId": 27,
    "label": 0
  },
  {
    "candidateId": 39,
    "jobId": 21,
    "label": 0
  },
  {
    "candidateId": 7,
    "jobId": 25,
    "label": 0
  },
  {
    "candidateId": 37,
    "jobId": 20,
    "label": 1
  },
  {
    "candidateId": 28,
    "jobId": 51,
    "label": 1
  },
  {
    "candidateId": 16,
    "jobId": 16,
    "label": 1
  },
  {
    "candidateId": 24,
    "jobId": 59,
    "label": 0
  },
  {
    "candidateId": 23,
    "jobId": 29,
    "label": 1
  },
  {
    "candidateId": 10,
    "jobId": 46,
    "label": 0
  },
  {
    "candidateId": 7,
    "jobId": 42,
    "label": 1
  },
  {
    "candidateId": 6,
    "jobId": 26,
    "label": 0
  },
  {
    "candidateId": 16,
    "jobId": 19,
    "label": 1
  },
  {
    "candidateId": 36,
    "jobId": 37,
    "label": 0
  },
  {
    "candidateId": 32,
    "jobId": 40,
    "label": 0
  },
  {
    "candidateId": 42,
    "jobId": 22,
    "label": 0
  },
  {
    "candidateId": 20,
    "jobId": 59,
    "label": 1
  },
  {
    "candidateId": 30,
    "jobId": 51,
    "label": 1
  },
  {
    "candidateId": 44,
    "jobId": 56,
    "label": 1
  },
  {
    "candidateId": 11,
    "jobId": 12,
    "label": 0
  },
  {
    "candidateId": 29,
    "jobId": 44,
    "label": 1
  },
  {
    "candidateId": 13,
    "jobId": 53,
    "label": 0
  },
  {
    "candidateId": 32,
    "jobId": 52,
    "label": 0
  },
  {
    "candidateId": 10,
    "jobId": 17,
    "label": 0
  },
  {
    "candidateId": 28,
    "jobId": 18,
    "label": 1
  },
  {
    "candidateId": 40,
    "jobId": 13,
    "label": 1
  },
  {
    "candidateId": 5,
    "jobId": 57,
    "label": 1
  },
  {
    "candidateId": 39,
    "jobId": 22,
    "label": 1
  },
  {
    "candidateId": 32,
    "jobId": 29,
    "label": 0
  },
  {
    "candidateId": 21,
    "jobId": 14,
    "label": 0
  },
  {
    "candidateId": 43,
    "jobId": 48,
    "label": 1
  },
  {
    "candidateId": 29,
    "jobId": 42,
    "label": 0
  },
  {
    "candidateId": 49,
    "jobId": 59,
    "label": 1
  },
  {
    "candidateId": 20,
    "jobId": 16,
    "label": 0
  },
  {
    "candidateId": 20,
    "jobId": 50,
    "label": 1
  },
  {
    "candidateId": 17,
    "jobId": 18,
    "label": 1
  },
  {
    "candidateId": 18,
    "jobId": 22,
    "label": 1
  },
  {
    "candidateId": 44,
    "jobId": 14,
    "label": 1
  },
  {
    "candidateId": 19,
    "jobId": 17,
    "label": 0
  },
  {
    "candidateId": 41,
    "jobId": 45,
    "label": 0
  },
  {
    "candidateId": 48,
    "jobId": 32,
    "label": 1
  },
  {
    "candidateId": 23,
    "jobId": 19,
    "label": 1
  },
  {
    "candidateId": 20,
    "jobId": 19,
    "label": 0
  },
  {
    "candidateId": 5,
    "jobId": 10,
    "label": 1
  },
  {
    "candidateId": 13,
    "jobId": 11,
    "label": 1
  },
  {
    "candidateId": 16,
    "jobId": 50,
    "label": 0
  },
  {
    "candidateId": 27,
    "jobId": 48,
    "label": 0
  },
  {
    "candidateId": 32,
    "jobId": 23,
    "label": 0
  },
  {
    "candidateId": 3,
    "jobId": 20,
    "label": 0
  },
  {
    "candidateId": 31,
    "jobId": 59,
    "label": 0
  },
  {
    "candidateId": 33,
    "jobId": 31,
    "label": 1
  },
  {
    "candidateId": 43,
    "jobId": 33,
    "label": 1
  },
  {
    "candidateId": 31,
    "jobId": 25,
    "label": 1
  },
  {
    "candidateId": 10,
    "jobId": 55,
    "label": 0
  },
  {
    "candidateId": 40,
    "jobId": 28,
    "label": 1
  },
  {
    "candidateId": 44,
    "jobId": 35,
    "label": 1
  },
  {
    "candidateId": 26,
    "jobId": 26,
    "label": 1
  },
  {
    "candidateId": 3,
    "jobId": 18,
    "label": 0
  },
  {
    "candidateId": 16,
    "jobId": 18,
    "label": 1
  },
  {
    "candidateId": 47,
    "jobId": 47,
    "label": 1
  },
  {
    "candidateId": 18,
    "jobId": 21,
    "label": 0
  },
  {
    "candidateId": 46,
    "jobId": 24,
    "label": 1
  },
  {
    "candidateId": 25,
    "jobId": 41,
    "label": 0
  },
  {
    "candidateId": 27,
    "jobId": 43,
    "label": 0
  },
  {
    "candidateId": 1,
    "jobId": 43,
    "label": 0
  },
  {
    "candidateId": 41,
    "jobId": 36,
    "label": 0
  },
  {
    "candidateId": 7,
    "jobId": 49,
    "label": 1
  },
  {
    "candidateId": 44,
    "jobId": 36,
    "label": 1
  },
  {
    "candidateId": 8,
    "jobId": 57,
    "label": 0
  },
  {
    "candidateId": 38,
    "jobId": 53,
    "label": 1
  },
  {
    "candidateId": 12,
    "jobId": 13,
    "label": 1
  },
  {
    "candidateId": 2,
    "jobId": 19,
    "label": 0
  },
  {
    "candidateId": 48,
    "jobId": 17,
    "label": 0
  },
  {
    "candidateId": 34,
    "jobId": 24,
    "label": 0
  },
  {
    "candidateId": 13,
    "jobId": 22,
    "label": 0
  },
  {
    "candidateId": 11,
    "jobId": 40,
    "label": 1
  },
  {
    "candidateId": 3,
    "jobId": 12,
    "label": 1
  },
  {
    "candidateId": 35,
    "jobId": 26,
    "label": 1
  },
  {
    "candidateId": 41,
    "jobId": 39,
    "label": 1
  },
  {
    "candidateId": 8,
    "jobId": 56,
    "label": 0
  },
  {
    "candidateId": 27,
    "jobId": 31,
    "label": 0
  },
  {
    "candidateId": 27,
    "jobId": 23,
    "label": 0
  },
  {
    "candidateId": 23,
    "jobId": 11,
    "label": 0
  },
  {
    "candidateId": 4,
    "jobId": 32,
    "label": 1
  },
  {
    "candidateId": 35,
    "jobId": 15,
    "label": 1
  },
  {
    "candidateId": 6,
    "jobId": 18,
    "label": 0
  },
  {
    "candidateId": 46,
    "jobId": 12,
    "label": 0
  },
  {
    "candidateId": 9,
    "jobId": 39,
    "label": 1
  },
  {
    "candidateId": 25,
    "jobId": 15,
    "label": 0
  },
  {
    "candidateId": 43,
    "jobId": 45,
    "label": 1
  },
  {
    "candidateId": 32,
    "jobId": 45,
    "label": 1
  },
  {
    "candidateId": 8,
    "jobId": 54,
    "label": 1
  },
  {
    "candidateId": 50,
    "jobId": 43,
    "label": 1
  },
  {
    "candidateId": 34,
    "jobId": 37,
    "label": 1
  },
  {
    "candidateId": 38,
    "jobId": 11,
    "label": 0
  },
  {
    "candidateId": 40,
    "jobId": 38,
    "label": 1
  },
  {
    "candidateId": 29,
    "jobId": 27,
    "label": 1
  },
  {
    "candidateId": 50,
    "jobId": 57,
    "label": 0
  },
  {
    "candidateId": 4,
    "jobId": 15,
    "label": 0
  },
  {
    "candidateId": 9,
    "jobId": 16,
    "label": 0
  },
  {
    "candidateId": 44,
    "jobId": 34,
    "label": 1
  },
  {
    "candidateId": 27,
    "jobId": 11,
    "label": 1
  },
  {
    "candidateId": 42,
    "jobId": 11,
    "label": 0
  },
  {
    "candidateId": 36,
    "jobId": 10,
    "label": 0
  },
  {
    "candidateId": 32,
    "jobId": 28,
    "label": 0
  },
  {
    "candidateId": 15,
    "jobId": 21,
    "label": 0
  },
  {
    "candidateId": 24,
    "jobId": 39,
    "label": 1
  },
  {
    "candidateId": 38,
    "jobId": 21,
    "label": 1
  },
  {
    "candidateId": 9,
    "jobId": 13,
    "label": 0
  },
  {
    "candidateId": 10,
    "jobId": 21,
    "label": 1
  },
  {
    "candidateId": 43,
    "jobId": 16,
    "label": 0
  },
  {
    "candidateId": 14,
    "jobId": 29,
    "label": 1
  },
  {
    "candidateId": 28,
    "jobId": 12,
    "label": 0
  },
  {
    "candidateId": 33,
    "jobId": 51,
    "label": 0
  },
  {
    "candidateId": 10,
    "jobId": 58,
    "label": 0
  },
  {
    "candidateId": 14,
    "jobId": 14,
    "label": 0
  },
  {
    "candidateId": 40,
    "jobId": 56,
    "label": 0
  },
  {
    "candidateId": 49,
    "jobId": 47,
    "label": 0
  },
  {
    "candidateId": 45,
    "jobId": 17,
    "label": 0
  },
  {
    "candidateId": 21,
    "jobId": 42,
    "label": 0
  },
  {
    "candidateId": 35,
    "jobId": 27,
    "label": 1
  },
  {
    "candidateId": 45,
    "jobId": 25,
    "label": 1
  },
  {
    "candidateId": 17,
    "jobId": 26,
    "label": 0
  },
  {
    "candidateId": 33,
    "jobId": 12,
    "label": 1
  },
  {
    "candidateId": 45,
    "jobId": 14,
    "label": 1
  },
  {
    "candidateId": 46,
    "jobId": 52,
    "label": 1
  },
  {
    "candidateId": 41,
    "jobId": 44,
    "label": 0
  },
  {
    "candidateId": 1,
    "jobId": 10,
    "label": 1
  },
  {
    "candidateId": 3,
    "jobId": 10,
    "label": 1
  },
  {
    "candidateId": 20,
    "jobId": 51,
    "label": 0
  },
  {
    "candidateId": 13,
    "jobId": 10,
    "label": 0
  },
  {
    "candidateId": 36,
    "jobId": 39,
    "label": 0
  },
  {
    "candidateId": 6,
    "jobId": 43,
    "label": 1
  },
  {
    "candidateId": 21,
    "jobId": 41,
    "label": 1
  },
  {
    "candidateId": 16,
    "jobId": 54,
    "label": 1
  },
  {
    "candidateId": 2,
    "jobId": 35,
    "label": 0
  },
  {
    "candidateId": 2,
    "jobId": 30,
    "label": 0
  },
  {
    "candidateId": 25,
    "jobId": 11,
    "label": 0
  },
  {
    "candidateId": 21,
    "jobId": 17,
    "label": 1
  },
  {
    "candidateId": 35,
    "jobId": 22,
    "label": 1
  },
  {
    "candidateId": 12,
    "jobId": 17,
    "label": 0
  },
  {
    "candidateId": 42,
    "jobId": 33,
    "label": 0
  },
  {
    "candidateId": 29,
    "jobId": 20,
    "label": 1
  },
  {
    "candidateId": 42,
    "jobId": 16,
    "label": 1
  },
  {
    "candidateId": 2,
    "jobId": 32,
    "label": 0
  },
  {
    "candidateId": 26,
    "jobId": 20,
    "label": 0
  },
  {
    "candidateId": 2,
    "jobId": 55,
    "label": 1
  },
  {
    "candidateId": 47,
    "jobId": 56,
    "label": 0
  },
  {
    "candidateId": 19,
    "jobId": 10,
    "label": 1
  },
  {
    "candidateId": 2,
    "jobId": 15,
    "label": 1
  },
  {
    "candidateId": 2,
    "jobId": 11,
    "label": 1
  },
  {
    "candidateId": 32,
    "jobId": 54,
    "label": 0
  },
  {
    "candidateId": 22,
    "jobId": 23,
    "label": 1
  }
]
$$::jsonb AS data
)
INSERT INTO public.match_history (candidate_id, job_id, label)
SELECT
  (item ->> 'candidateId')::bigint,
  (item ->> 'jobId')::bigint,
  (item ->> 'label')::smallint
FROM history_payload,
LATERAL jsonb_array_elements(data) AS item
WHERE NOT EXISTS (
  SELECT 1
  FROM public.match_history mh
  WHERE mh.candidate_id = (item ->> 'candidateId')::bigint
    AND mh.job_id = (item ->> 'jobId')::bigint
    AND mh.label = (item ->> 'label')::smallint
);

COMMIT;
