"use strict";

/**
 * Recommendation.js controller
 *
 * @description: A set of functions called "actions" for managing `Recommendation`.
 */

module.exports = {
  /**
   * Retrieve recommendation records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.services.recommendation.search(ctx.query);
    } else {
      return strapi.services.recommendation.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a recommendation record.
   *
   * @return {Object}
   */

  findOne: async ctx => {
    return strapi.services.recommendation.fetch(ctx.params);
  },

  /**
   * Count recommendation records.
   *
   * @return {Number}
   */

  count: async (ctx, next, { populate } = {}) => {
    return strapi.services.recommendation.count(ctx.query, populate);
  },

  /**
   * Create a/an recommendation record.
   *
   * @return {Object}
   */

  create: async ctx => {
    return strapi.services.recommendation.add(ctx.request.body);
  },

  /**
   * Update a/an recommendation record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.recommendation.edit(ctx.params, ctx.request.body);
  },

  /**
   * Destroy a/an recommendation record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.recommendation.remove(ctx.params);
  },

  /**
   * 4.一个public API，返回某个推荐id的汽车数据
   */
  getCars: async (ctx, next) => {
    const { id } = ctx.query;
    let recommendation = await strapi.services.recommendation.fetch({ id });
    recommendation = recommendation.toJSON();

    if (!recommendation) {
      // throw "Recommendation Not Exist";
    }

    let cond = {
      make_in: recommendation.makes && recommendation.makes.split(","),
      price_lte: recommendation.price_max,
      price_gte: recommendation.price_min,
      year_lte: recommendation.year_max,
      year_gte: recommendation.year_min
    };
    let cars = await strapi.services.car.fetchAll(cond);

    return cars;
  }
};
