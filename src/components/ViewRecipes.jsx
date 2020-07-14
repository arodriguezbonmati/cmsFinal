import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";
import { OK, Error, Title } from "../style/styles";

const RECIPES_LIST_QUERY = gql`{
    recipes{
    title
    _id
    }
  }
`;

const RECIPE_QUERY = gql`
  query recipe($id: ID!){
    recipe(id: $id){
      title
      description
      steps{
        description
        image{
          url
        }
      }
      date
      ingredients{
        name
      }
      mainImage{
        url
      }
    }
}`

export default () => {
  const [recipeID, setRecipeID] = useState(null);
  const { loading, error, data } = useQuery(RECIPES_LIST_QUERY);
  const [recipe, {
    loading: loadingRecipe,
    error: errorRecipe,
    data: dataRecipe
  }] = useLazyQuery(RECIPE_QUERY)

  useEffect(() => {
    if (recipeID) {
      recipe({
        variables: {
          id: recipeID
        }
      })
    }
  }, [recipeID]);

  if (loading) return <p>Cargando recetas...</p>;
  if (error) return <p>Error cargando recetas.</p>;

  if (loadingRecipe) return <p>Cargando receta...</p>;
  if (errorRecipe) return <p>Error cargando receta.</p>;

  return (
    <RecipesShow>
      <RecipesList>
        {console.log("Receta", dataRecipe)}
        <Title>Recetas Disponibles</Title>
        <div className="recipesList">
          {data ?
            data.recipes.map((i) => {
              return (
                <Recipe>
                  <p onClick={() => setRecipeID(i._id)}>{i.title}</p>
                </Recipe>
              )
            })
            : null}
        </div>
      </RecipesList>
      <div className="receta">
        {dataRecipe ?
          <div className="info">
            <Title>{dataRecipe.recipe.title}</Title>
            <div className="mainPhoto">
              <img src={`http://77.228.91.193/${dataRecipe.recipe.mainImage.url}`} />
            </div>
            <Date>{dataRecipe.recipe.date}</Date>
            <Descripcion>{dataRecipe.recipe.description}</Descripcion>
            <Ingredientes>
              Ingredientes: 
              {dataRecipe.recipe.ingredients.map((e) => {
                return (
                  <p> - {e.name}</p>
                )
              })}
            </Ingredientes>
            <div className="steps">
              Pasos a realizar:
              {dataRecipe.recipe.steps.map((q, index) => {
                return (
                  <Stepbystep>
                    <img src={`http://77.228.91.193/${q.image.url}`}></img>
                    <span>{index + 1} - {q.description}</span>
                  </Stepbystep>
                )
              })}
            </div>
          </div>
          : null}
      </div>
    </RecipesShow>
  )

};

const Date = styled.p`
  font-weight: bold;
`;

const Descripcion = styled.p`
  width: 640px;
`;

const RecipesList = styled.div`
  color: #333333;
  margin: 2em;
  margin-top: 0px;
`;

const RecipesShow = styled.div`
  display: flex;
`;

const Recipe = styled.div`
  margin-left: 1em;
  cursor: pointer;
  border-radius: 5px;

  &:hover{
    background-color: beige;
  }
`;

const Stepbystep = styled.div`
  display: flex;
`;

const Ingredientes = styled.div`
  border-radius: 8px;
  background-color: cornsilk;
  padding: 5px;
  width: fit-content;
  right: 10px;
  margin: 0px;
`;

