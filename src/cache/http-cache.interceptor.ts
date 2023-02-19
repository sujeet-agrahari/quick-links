import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
/* If the request is a GET request and the request URL is not in the excludeCachePaths, then cache the response. */
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';

    /* Excluding the `/health` endpoint from being cached. */
    const excludePaths = ['/health'];
    if (
      !isGetRequest ||
      (isGetRequest &&
        excludePaths?.includes(httpAdapter.getRequestUrl(request)))
    ) {
      return undefined;
    }
    return httpAdapter.getRequestUrl(request);
  }
}
