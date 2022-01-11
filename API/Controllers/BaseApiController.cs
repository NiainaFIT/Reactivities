using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

using MediatR;

using Application.Core;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _madiator;
        protected IMediator Mediator => _madiator ??= HttpContext.RequestServices
                                        .GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result){
             
             if(result == null) return NotFound();
             if(result.IsSuccess && result.Value != null)
            return Ok(result.Value);

            if(result.IsSuccess && result.Value == null)
            return NotFound();

            return BadRequest(result.Error);
        }
    }
}