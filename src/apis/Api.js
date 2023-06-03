import _ from "lodash";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useComponentDidUpdate, usePrevious } from "../helpers/Hook";
import { toast } from "react-toastify";
import axios from "axios";

const hash = require("object-hash");

let sources = {};
const defaultTimeout = 30000;

export default class Api {
  axiosOptions;
  rqOptions;
  onResponse;
  onFailure;
  after;
  before;
  validation;
  #sourceKey;
  timeout;
  cache;

  constructor(initializer = {}) {
    this.onResponse =
      initializer.onResponse ??
      (() => {
        throw Error("onResponse Should Be Override");
      });
    this.onFailure =
      initializer.onFailure ??
      ((error, errorHandler) => {
        errorHandler();
      });
    this.after = initializer.after;
    this.before = initializer.before;
    this.validation = initializer.validation;
    this.axiosOptions = initializer.axiosOptions ?? {};
    this.rqOptions = initializer.axiosOptions ?? {};
    this.#sourceKey = initializer.sourceKey;
    this.timeout = initializer.timeout ?? defaultTimeout;
    this.cache = initializer.cache ?? { storage: "none" };
  }

  errorHandler = (error) => {
    if (error.response) {
      const { data, status } = error.response;
      const { message = null } = data || {};

      if (message) {
        toast.error(message);
      } else {
        this.handleStatusCodes(status);
      }

      if (status === 401) {
        this.logout(true);
      }
    } else if (error.request) {
    } else {
    }
  };

  handleStatusCodes = (statusCode) => {
    switch (statusCode) {
      default:
        throw new Error("Error");
    }
  };

  logout(redirect = true) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  cacheInterceptor(url, json, options, cache) {
    const axiosInstance = axios.create();

    switch (cache.storage) {
      case "none": {
        return axios(options);
      }
      case "localStorage": {
        const key = `api_cache:${hash({
          url,
          json,
          headers: options.headers,
        })}`;
        axiosInstance.interceptors.response.use((response) => {
          this.#addToCache(key, response);
          return Promise.resolve(response);
        });

        const cacheResponse = this.#getFromCache(key);

        if (cacheResponse) {
          axiosInstance(options).catch(() => {});
          return Promise.resolve(cacheResponse);
        } else {
          return axiosInstance(options);
        }
      }
      default: {
        return axiosInstance(options);
      }
    }
  }

  cancel = () => {
    if (!this.getSourceKey()) {
      return;
    }

    (sources[this.getSourceKey()] ?? []).forEach((source) => {
      if (source && typeof source.cancel === "function") {
        source.cancel();
      }
    });

    delete sources[this.getSourceKey()];
  };

  get = (url = "", params = {}) => {
    const headers = !!localStorage.getItem("token")
      ? {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/json",
        }
      : {
          Accept: "application/json",
        };

    const options = {
      cancelToken: this.generateToken(),
      headers,
      ...this.axiosOptions,
      method: "GET",
      url,
      params,
      timeout: this.timeout,
    };

    return this.cacheInterceptor(url, params, options, this.cache);
  };

  post = (url = "", data = {}) => {
    const headers = !!localStorage.getItem("token")
      ? {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/json",
        }
      : {
          Accept: "application/json",
        };

    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const options = {
      cancelToken: this.generateToken(),
      headers,
      ...this.axiosOptions,
      method: "POST",
      url,
      data,
      timeout: this.timeout,
    };

    return this.cacheInterceptor(url, data, options, this.cache);
  };

  put = (url = "", data = {}) => {
    let method = "PUT";

    const headers = !!localStorage.getItem("token")
      ? {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/json",
        }
      : {
          Accept: "application/json",
        };

    if (data instanceof FormData) {
      data.append("_method", "PUT");
      method = "POST";
    } else {
      headers["Content-Type"] = "application/json";
    }

    const options = {
      cancelToken: this.generateToken(),
      headers,
      ...this.axiosOptions,
      method,
      url,
      data,
      timeout: this.timeout,
    };

    return this.cacheInterceptor(url, data, options, this.cache);
  };

  patch = (url = "", data = {}) => {
    let method = "PATCH";

    const headers = !!localStorage.getItem("token")
      ? {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/json",
        }
      : {
          Accept: "application/json",
        };

    if (data instanceof FormData) {
      data.append("_method", "PATCH");
      method = "POST";
    } else {
      headers["Content-Type"] = "application/json";
    }

    const options = {
      cancelToken: this.generateToken(),
      headers,
      ...this.axiosOptions,
      method,
      url,
      data,
      timeout: this.timeout,
    };

    return this.cacheInterceptor(url, data, options, this.cache);
  };

  delete = (url = "", data = {}) => {
    const headers = !!localStorage.getItem("token")
      ? {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
        };

    const options = {
      cancelToken: this.generateToken(),
      headers,
      ...this.axiosOptions,
      method: "DELETE",
      url,
      data,
      timeout: this.timeout,
    };

    return this.cacheInterceptor(url, data, options, this.cache);
  };

  onCall = () => {
    throw Error("onCall Should Be Overridden");
  };

  async = (...params) => {
    if (this.validation && typeof this.validation === "function") {
      if (!this.validation(...params)) return;
    }

    if (this.before && typeof this.before === "function") {
      this.before();
    }

    if (this.onCall && typeof this.onCall === "function") {
      this.onCall(...params)
        .then((response) => {
          this.onResponse(response, params);
        })
        .catch((error) => {
          this.onFailure(
            error,
            () => this.errorHandler(error),
            axios.isCancel(error)
          );
        });
    }

    if (this.after && typeof this.after === "function") {
      this.after();
    }
  };

  sync = async (...params) => {
    if (this.validation && typeof this.validation === "function") {
      if (!this.validation(...params)) return;
    }

    if (this.before && typeof this.before === "function") {
      this.before();
    }

    if (this.onCall && typeof this.onCall === "function") {
      await this.onCall(...params)
        .then((response) => this.onResponse(response, params))
        .catch((error) => {
          this.onFailure(
            error,
            () => this.errorHandler(error),
            axios.isCancel(error)
          );
        });
    }

    if (this.after && typeof this.after === "function") {
      this.after();
    }
  };

  promise = (...params) => {
    if (this.validation && typeof this.validation === "function") {
      if (!this.validation(...params)) return;
    }

    if (this.before && typeof this.before === "function") {
      this.before();
    }

    if (this.onCall && typeof this.onCall === "function") {
      return this.onCall(...params).catch((error) => {
        this.onFailure(
          error,
          () => this.errorHandler(error),
          axios.isCancel(error)
        );
      });
    }

    if (this.after && typeof this.after === "function") {
      this.after();
    }
  };

  generateToken = () => {
    if (!this.getSourceKey()) {
      return;
    }

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    sources = {
      ...sources,
      ...{
        [this.getSourceKey()]: [
          ...(sources[this.getSourceKey()] ?? []).slice(-9),
          source,
        ],
      },
    };

    return source.token;
  };

  #addToCache = (key, payload) => {
    try {
      const cacheObject = JSON.parse(
        localStorage.getItem("AXIOS_CACHE") ?? "{}"
      );

      localStorage.setItem(
        "AXIOS_CACHE",
        JSON.stringify(
          _.set(cacheObject, `apis.${key}`, {
            payload,
            ttl: Date.now() + this.cache.ttl * 1000,
          })
        )
      );
    } catch (e) {}
  };

  #getFromCache = (key) => {
    try {
      const cacheObject = JSON.parse(
        localStorage.getItem("AXIOS_CACHE") ?? "{}"
      );

      const cacheResponse = _.get(cacheObject, `apis.${key}`);

      if (cacheResponse) {
        if (Date.now() < cacheResponse.ttl) {
          return cacheResponse.payload;
        } else {
          _.unset(cacheObject, `apis.${key}`);
          localStorage.setItem("AXIOS_CACHE", JSON.stringify(cacheObject));
          return null;
        }
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  };

  // React Query

  useQuery = (...params) => {
    const key = this.#useGetRqKey([this.getRQKey(), ...params], this.rqOptions);

    const result = useQuery(
      key,
      ({ signal }) => {
        this.axiosOptions.signal = signal;
        return this.onCall(...params);
      },
      {
        enabled:
          typeof this.validation === "function"
            ? this.validation(...params)
            : true,
        ...this.rqOptions,
      }
    );

    useEffect(() => {
      if (result.data) {
        this.onResponse(result.data, params);
      }
    }, [result.data]);

    useEffect(() => {
      if (result.error) {
        this.onFailure(
          result.error,
          () => this.errorHandler(result.error),
          axios.isCancel(result.error)
        );
      }
    }, [result.error]);

    return result;
  };

  useLazyQuery = (...params) => {
    const key = this.#useGetRqKey([this.getRQKey(), ...params], this.rqOptions);
    const prevKey = usePrevious(key);

    const [enabled, setEnabled] = useState(false);

    useComponentDidUpdate(() => {
      if (!enabled) setEnabled(true);
    }, [...params]);

    const result = useQuery(
      key,
      ({ signal }) => {
        this.axiosOptions.signal = signal;
        return this.onCall(...params);
      },
      {
        enabled:
          typeof this.validation === "function"
            ? this.validation(...params) && enabled && !_.isEqual(prevKey, key)
            : enabled && !_.isEqual(prevKey, key),
        ...this.rqOptions,
      }
    );

    useEffect(() => {
      if (result.data) {
        this.onResponse(result.data, params);
      }
    }, [result.data]);

    useEffect(() => {
      if (result.error) {
        this.onFailure(
          result.error,
          () => this.errorHandler(result.error),
          axios.isCancel(result.error)
        );
      }
    }, [result.error]);

    return result;
  };

  useMutation = (...params) => {
    const key = this.#useGetRqKey([this.getRQKey(), ...params], this.rqOptions);

    const result = useMutation(key, (params) => this.onCall(...params), {
      ...this.rqOptions,
    });

    useEffect(() => {
      if (result.data) {
        this.onResponse(result.data, params);
      }
    }, [result.data]);

    useEffect(() => {
      if (result.error) {
        this.onFailure(
          result.error,
          () => this.errorHandler(result.error),
          axios.isCancel(result.error)
        );
      }
    }, [result.error]);

    return {
      ...result,
      mutate: (...params) => result.mutate(params),
    };
  };

  #useGetRqKey = (key, rqOptions) => {
    const { debounce: debounceTime } = rqOptions;
    const [debouncedKey, setDebouncedKey] = useState(key);

    useEffect(() => {
      if (_.isEqual(key, debouncedKey)) return;
      const debouncedSetKey = _.debounce(setDebouncedKey, debounceTime);
      debouncedSetKey(key);
      return () => debouncedSetKey.cancel();
    }, [key, debounceTime]);

    return debouncedKey;
  };

  #getId = () => {

    if (this.constructor.hasOwnProperty("id")) {
      return this.constructor.id;
    }

    return this.constructor;
  };
  getRQKey = () => {
    return this.#getId();
  };

  getSourceKey = () => {
    return this.#sourceKey ?? this.#getId();
  };
}
