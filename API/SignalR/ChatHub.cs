using System;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;
using MediatR;

using Application.Comments;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }
        //on the client side after connecting to hub this method will be invoked by this method name 
        public async Task SendComment(Create.Command command)
        {
            //saving comment to database
            var comment = await _mediator.Send(command);
            //adding saved comment to connected clients to activity group
            await Clients.Group(command.ActivityId.ToString())
                    .SendAsync("ReceiveComment", comment.Value);//ReceiveComment is method on client side that will receive sent comment 
        }
        //when client connects to hub this method joins him to group 
        public override async Task OnConnectedAsync()
        {
            //to get activityId from query string from httpcontext
            var httpContex = Context.GetHttpContext();

            var activityId = httpContex.Request.Query["activityId"];
            //adding connection id to the group with parameter value activityId
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

            //get list of coments from database for activity
            var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });
            //Loading comments on client side
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}
