import {
  HandlerWillRespondCallbackParam,
  HandlerWillStartCallbackParam,
  WorkboxPlugin,
} from "workbox-core/types";

export class MetaPlugin implements WorkboxPlugin {
  private requestTimestampMap = new Map<Request, number>();

  async handlerWillStart({ request }: HandlerWillStartCallbackParam) {
    this.requestTimestampMap.set(request, new Date().getTime());
  }

  async handlerWillRespond({
    request,
    response,
  }: HandlerWillRespondCallbackParam) {
    const requestTimestamp = this.requestTimestampMap.get(request)!;
    const responseTimestamp = new Date(response.headers.get("Date")!).getTime();

    this.requestTimestampMap.delete(request);

    const json = await response.clone().json();
    return new Response(
      JSON.stringify({
        payload: json.payload,
        meta: {
          isCached: responseTimestamp < requestTimestamp,
          timestamp: responseTimestamp || requestTimestamp,
        },
      }),
      {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      },
    );
  }
}
